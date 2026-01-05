import { BadRequestException, Injectable } from "@nestjs/common"
import { getImageExtension } from "@app/storage/image-types.const"
import { ConfigService } from "@nestjs/config"
import type { CreateUserDto } from "./dto/create-user.dto"
import type { UpdateUserDto } from "./dto/update-user.dto"
import { PrismaService } from "@app/prisma/prisma.service"
import { StorageService } from "@app/storage/storage.service"
import { uuidv7 } from "uuidv7"

@Injectable()
export class UserService {
  private readonly bucket: string
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly config: ConfigService,
  ) {
    this.bucket = this.config.get<string>("S3_BUCKET") ?? "catus-media"
  }

  create(createUserDto: CreateUserDto, kakaoId: string) {
    const { favoritePersonalities, favoriteAppearances, ...rest } = createUserDto

    return this.prisma.user.create({
      data: {
        ...rest,
        kakaoId,
        ...(favoritePersonalities?.length && {
          favoritePersonalities: {
            connect: favoritePersonalities.map((id) => ({ id })),
          },
        }),
        ...(favoriteAppearances?.length && {
          favoriteAppearances: {
            connect: favoriteAppearances.map((id) => ({ id })),
          },
        }),
      },
    })
  }

  async checkNickname(nickname: string) {
    const nicknameTaken = await this.prisma.user.findUnique({
      where: { nickname },
      select: { hasAgreedToTerms: true },
    })

    return { available: !nicknameTaken }
  }

  getMe(userId: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    })
  }

  getOne(userId: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        nickname: true,
        profileImageUrl: true,
        followerCount: true,
        followingCount: true,
      },
    })
  }

  async follow(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new BadRequestException("You cannot follow yourself")
    }

    return this.prisma.$transaction(async (tx) => {
      await Promise.all([
        tx.user.findUniqueOrThrow({ where: { id: followerId }, select: { id: true } }),
        tx.user.findUniqueOrThrow({ where: { id: followingId }, select: { id: true } }),
      ])

      await tx.follow.create({
        data: { followerId, followingId },
      })

      const [follower, target] = await Promise.all([
        tx.user.update({
          where: { id: followerId },
          data: { followingCount: { increment: 1 } },
          select: { id: true, followingCount: true },
        }),
        tx.user.update({
          where: { id: followingId },
          data: { followerCount: { increment: 1 } },
          select: { id: true, followerCount: true },
        }),
      ])

      return {
        follower,
        target,
      }
    })
  }

  async unfollow(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new BadRequestException("You cannot unfollow yourself")
    }

    return this.prisma.$transaction(async (tx) => {
      await Promise.all([
        tx.user.findUniqueOrThrow({ where: { id: followerId }, select: { id: true } }),
        tx.user.findUniqueOrThrow({ where: { id: followingId }, select: { id: true } }),
      ])

      await tx.follow.delete({
        where: {
          followerId_followingId: { followerId, followingId },
        },
      })

      const [follower, target] = await Promise.all([
        tx.user.update({
          where: { id: followerId },
          data: { followingCount: { decrement: 1 } },
          select: { id: true, followingCount: true },
        }),
        tx.user.update({
          where: { id: followingId },
          data: { followerCount: { decrement: 1 } },
          select: { id: true, followerCount: true },
        }),
      ])

      return {
        follower,
        target,
      }
    })
  }

  update(userId: string, updateUserDto: UpdateUserDto) {
    const { favoritePersonalities, favoriteAppearances, ...rest } = updateUserDto

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...rest,
        ...(favoritePersonalities !== undefined && {
          favoritePersonalities: {
            set: favoritePersonalities.map((id) => ({ id })),
          },
        }),
        ...(favoriteAppearances !== undefined && {
          favoriteAppearances: {
            set: favoriteAppearances.map((id) => ({ id })),
          },
        }),
      },
    })
  }

  remove(userId: string) {
    return this.prisma.user.delete({ where: { id: userId } })
  }

  async getProfileImageUploadUrl(userId: string, contentType?: string) {
    if (!contentType) {
      throw new BadRequestException("contentType required")
    }
    const ext = getImageExtension(contentType)
    if (!ext) {
      throw new BadRequestException("Only image content types are allowed: jpeg, png, webp, avif")
    }
    const unique = uuidv7()
    const objectKey = `users/${userId}/profile/${unique}.${ext}`

    const { url, fields } = await this.storage.getPresignedUploadUrl(this.bucket, objectKey, {
      contentType,
      expiresInSeconds: 60 * 2,
      maxSizeBytes: 5 * 1024 * 1024,
    })

    return { url, fields }
  }
}
