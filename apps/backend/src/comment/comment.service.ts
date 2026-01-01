import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common"
import { PrismaService } from "@app/prisma/prisma.service"
import { CreateCommentDto } from "./dto/create-comment.dto"

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(postId: string, authorId: string, dto: CreateCommentDto) {
    const { content, parentId } = dto
    if (!content?.trim()) {
      throw new BadRequestException("content is required")
    }

    const post = await this.prisma.post.findUnique({ where: { id: postId }, select: { id: true } })
    if (!post) {
      throw new BadRequestException("post not found")
    }

    let normalizedParentId: string | null = null
    if (parentId) {
      const parent = await this.prisma.comment.findUnique({
        where: { id: parentId },
        select: { id: true, postId: true },
      })
      if (!parent || parent.postId !== postId) {
        throw new BadRequestException("invalid parent comment")
      }
      normalizedParentId = parentId
    }

    return this.prisma.comment.create({
      data: {
        content,
        postId,
        authorId,
        parentId: normalizedParentId,
      },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            profileImageUrl: true,
          },
        },
      },
    })
  }

  async getPostComments(postId: string, userId: string, cursor?: string | null, take = 20) {
    const pagination = this.prisma.getPaginator(cursor ?? null)

    const parents = await this.prisma.comment.findMany({
      ...pagination,
      take,
      where: {
        postId,
        parentId: null,
      },
      orderBy: { id: "desc" },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            profileImageUrl: true,
          },
        },
        commentLikes: {
          where: { userId },
          select: { userId: true },
        },
      },
    })

    if (parents.length === 0) {
      return []
    }

    const parentIds = parents.map((c) => c.id)

    const replies = await this.prisma.comment.findMany({
      where: {
        parentId: { in: parentIds },
      },
      orderBy: { id: "asc" },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            profileImageUrl: true,
          },
        },
        commentLikes: {
          where: { userId },
          select: { userId: true },
        },
      },
    })

    const replyMap = new Map<string, any[]>()

    for (const reply of replies) {
      const enriched = {
        ...reply,
        isLikedByMe: reply.commentLikes.length > 0,
      }

      if (!replyMap.has(reply.parentId!)) {
        replyMap.set(reply.parentId!, [])
      }
      replyMap.get(reply.parentId!)!.push(enriched)
    }

    return parents.map((comment) => ({
      ...comment,
      isLikedByMe: comment.commentLikes.length > 0,
      replies: replyMap.get(comment.id) ?? [],
    }))
  }

  async delete(id: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      select: { authorId: true },
    })

    if (!comment || comment.authorId !== userId) {
      throw new ForbiddenException("This is not your comment")
    }

    await this.prisma.comment.delete({ where: { id } })
  }

  async likeComment(commentId: string, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const comment = await tx.comment.findUnique({
        where: { id: commentId },
        select: { id: true },
      })

      if (!comment) {
        throw new BadRequestException("comment not found")
      }

      let likeCount: number

      try {
        await tx.commentLike.create({
          data: {
            commentId,
            userId,
          },
        })

        const updated = await tx.comment.update({
          where: { id: commentId },
          data: { likeCount: { increment: 1 } },
          select: { likeCount: true },
        })

        likeCount = updated.likeCount
      } catch (err: any) {
        if (err.code !== "P2002") {
          throw err
        }

        const current = await tx.comment.findUniqueOrThrow({
          where: { id: commentId },
          select: { likeCount: true },
        })

        likeCount = current.likeCount
      }

      return {
        likeCount,
      }
    })
  }

  async unlikeComment(commentId: string, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const comment = await tx.comment.findUnique({
        where: { id: commentId },
        select: { id: true },
      })

      if (!comment) {
        throw new BadRequestException("comment not found")
      }

      let likeCount: number

      const existing = await tx.commentLike.findUnique({
        where: {
          commentId_userId: {
            commentId,
            userId,
          },
        },
      })

      if (!existing) {
        const current = await tx.comment.findUniqueOrThrow({
          where: { id: commentId },
          select: { likeCount: true },
        })

        return {
          likeCount: current.likeCount,
        }
      }

      await tx.commentLike.delete({
        where: {
          commentId_userId: {
            commentId,
            userId,
          },
        },
      })

      const updated = await tx.comment.update({
        where: { id: commentId },
        data: { likeCount: { decrement: 1 } },
        select: { likeCount: true },
      })

      likeCount = updated.likeCount

      return {
        likeCount,
      }
    })
  }
}
