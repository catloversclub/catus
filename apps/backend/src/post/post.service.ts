import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common"
import { CreatePostDto } from "./dto/create-post.dto"
import { UpdatePostDto } from "./dto/update-post.dto"
import { PrismaService } from "@app/prisma/prisma.service"
import { StorageService } from "@app/storage/storage.service"
import { ConfigService } from "@nestjs/config"
import { uuidv7 } from "uuidv7"

@Injectable()
export class PostService {
  private readonly bucket: string

  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly config: ConfigService,
  ) {
    this.bucket = this.config.get<string>("S3_BUCKET") ?? "catus-media"
  }

  async create(authorId: string, createPostDto: CreatePostDto) {
    const { catId, content, imageUrls } = createPostDto

    const post = await this.prisma.post.create({
      data: {
        content: content ?? null,
        authorId,
        catId: catId ?? null,
      },
    })

    try {
      if (imageUrls && imageUrls.length > 0) {
        const images = await Promise.all(
          imageUrls.map(async (tmpKey, index) => {
            if (!tmpKey.startsWith(`tmp/post/${authorId}/`)) {
              throw new BadRequestException("invalid image key")
            }

            const fileName = tmpKey.split("/").pop()
            if (!fileName) {
              throw new BadRequestException("invalid image key")
            }

            const destKey = `posts/${post.id}/images/${fileName}`

            await this.storage.copyObject(this.bucket, tmpKey, destKey)

            return {
              postId: post.id,
              url: destKey,
              order: index + 1,
            }
          }),
        )

        if (images.length > 0) {
          await this.prisma.postImage.createMany({
            data: images,
          })
        }
      }

      return this.prisma.post.findUniqueOrThrow({
        where: { id: post.id },
        include: {
          cat: true,
          author: {
            select: {
              id: true,
              nickname: true,
            },
          },
          images: true,
        },
      })
    } catch (err) {
      await this.prisma.post.delete({
        where: { id: post.id },
      })
      throw err
    }
  }

  getUserPosts(userId: string, cursor?: string | null, take = 20) {
    const pagination = this.prisma.getPaginator(cursor ?? null)

    return this.prisma.post.findMany({
      ...pagination,
      take,
      where: { authorId: userId },
      orderBy: { id: "desc" },
      include: {
        cat: true,
        author: {
          select: {
            id: true,
            nickname: true,
            profileImageUrl: true,
          },
        },
        images: true,
      },
    })
  }

  getCatPosts(catId: string, cursor?: string | null, take = 20) {
    const pagination = this.prisma.getPaginator(cursor ?? null)

    return this.prisma.post.findMany({
      ...pagination,
      take,
      where: { catId },
      orderBy: { id: "desc" },
      include: {
        cat: true,
        author: {
          select: {
            id: true,
            nickname: true,
            profileImageUrl: true,
          },
        },
        images: true,
      },
    })
  }

  findAll(cursor?: string | null, take = 20) {
    const pagination = this.prisma.getPaginator(cursor ?? null)

    return this.prisma.post.findMany({
      ...pagination,
      take,
      orderBy: { id: "desc" },
      include: {
        cat: true,
        author: {
          select: {
            id: true,
            nickname: true,
            profileImageUrl: true,
          },
        },
        images: true,
      },
    })
  }

  findOne(id: string) {
    return this.prisma.post.findUniqueOrThrow({
      where: { id },
      include: {
        cat: true,
        author: {
          select: {
            id: true,
            nickname: true,
            profileImageUrl: true,
          },
        },
        images: true,
      },
    })
  }

  private async assertMyPost(id: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      select: { authorId: true },
    })

    if (!post || post.authorId !== userId) {
      throw new ForbiddenException("This is not your post")
    }
  }

  async update(id: string, userId: string, updatePostDto: UpdatePostDto) {
    await this.assertMyPost(id, userId)

    const { catId, ...rest } = updatePostDto

    return this.prisma.post.update({
      where: { id },
      data: {
        ...rest,
        ...(catId !== undefined && { catId: catId ?? null }),
      },
      include: {
        cat: true,
        author: {
          select: {
            id: true,
            nickname: true,
            profileImageUrl: true,
          },
        },
        images: true,
      },
    })
  }

  async delete(id: string, userId: string) {
    await this.assertMyPost(id, userId)

    return this.prisma.post.delete({ where: { id } })
  }

  async likePost(postId: string, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const post = await tx.post.findUnique({
        where: { id: postId },
        select: { id: true },
      })

      if (!post) {
        throw new BadRequestException("post not found")
      }

      let likeCount: number

      try {
        await tx.postLike.create({
          data: { postId, userId },
        })

        const updated = await tx.post.update({
          where: { id: postId },
          data: { likeCount: { increment: 1 } },
          select: { likeCount: true },
        })

        likeCount = updated.likeCount
      } catch (err: any) {
        if (err.code !== "P2002") {
          throw err
        }

        const current = await tx.post.findUniqueOrThrow({
          where: { id: postId },
          select: { likeCount: true },
        })

        likeCount = current.likeCount
      }

      return {
        likeCount,
      }
    })
  }

  async unlikePost(postId: string, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const post = await tx.post.findUnique({
        where: { id: postId },
        select: { id: true },
      })

      if (!post) {
        throw new BadRequestException("post not found")
      }

      let likeCount: number

      const existing = await tx.postLike.findUnique({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      })

      if (!existing) {
        const current = await tx.post.findUniqueOrThrow({
          where: { id: postId },
          select: { likeCount: true },
        })

        return {
          likeCount: current.likeCount,
        }
      }

      await tx.postLike.delete({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      })

      const updated = await tx.post.update({
        where: { id: postId },
        data: { likeCount: { decrement: 1 } },
        select: { likeCount: true },
      })

      likeCount = updated.likeCount

      return {
        likeCount,
      }
    })
  }

  async getImageUploadUrls(userId: string, count: number) {
    if (!count || count < 1) {
      throw new BadRequestException("count must be at least 1")
    }

    const uploads = await Promise.all(
      Array.from({ length: count }).map(async () => {
        const unique = uuidv7()
        const objectKey = `tmp/post/${userId}/${unique}.webp`

        const { url, fields } = await this.storage.getPresignedUploadUrl(this.bucket, objectKey, {
          contentType: "image/webp",
          expiresInSeconds: 60 * 2,
          maxSizeBytes: 5 * 1024 * 1024,
        })

        return { url, fields, key: objectKey }
      }),
    )

    return { uploads }
  }
}
