import { Author } from "@/api/domains/post/types"

export interface CommentLike {
  userId: string
}

export interface Comment {
  id: string
  postId: string
  authorId: string
  parentId: string | null
  content: string
  likeCount: number
  isLikedByMe: boolean
  createdAt: string
  author: Author
  commentLikes: CommentLike[]
  replies?: Comment[]
}

export type GetPostCommentsResponse = Comment[]

export interface CreateCommentRequest {
  content: string
}

export type CreateCommentResponse = Comment
