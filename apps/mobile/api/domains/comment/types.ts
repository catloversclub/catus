export interface Comment {
  commentId: number
  postId: number
  content: string
  likeCount?: number
  likedByMe?: boolean
}

export interface GetPostCommentsResponse {
  comments: Comment[]
}

export interface CreateCommentRequest {
  content: string
}

export type CreateCommentResponse = Comment
