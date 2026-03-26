import { apiClient } from "@/api/client"

import { CreateCommentRequest, CreateCommentResponse, GetPostCommentsResponse } from "./types"

const COMMENT_ENDPOINTS = {
  BY_POST: (postId: number) => `/posts/${postId}/comments`,
  DETAIL: (commentId: number) => `/comments/${commentId}`,
  LIKE: (commentId: number) => `/comments/${commentId}/like`,
} as const

export const getPostComments = async (postId: number): Promise<GetPostCommentsResponse> => {
  const { data } = await apiClient.get<GetPostCommentsResponse>(COMMENT_ENDPOINTS.BY_POST(postId))
  return data
}

export const createComment = async (
  postId: number,
  payload: CreateCommentRequest,
): Promise<CreateCommentResponse> => {
  const { data } = await apiClient.post<CreateCommentResponse>(
    COMMENT_ENDPOINTS.BY_POST(postId),
    payload,
  )
  return data
}

export const deleteComment = async (commentId: number): Promise<void> => {
  await apiClient.delete(COMMENT_ENDPOINTS.DETAIL(commentId))
}

export const likeComment = async (commentId: number): Promise<void> => {
  await apiClient.post(COMMENT_ENDPOINTS.LIKE(commentId))
}

export const unlikeComment = async (commentId: number): Promise<void> => {
  await apiClient.delete(COMMENT_ENDPOINTS.LIKE(commentId))
}
