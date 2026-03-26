import { apiClient } from "@/api/client"

import { CreateCommentRequest, CreateCommentResponse, GetPostCommentsResponse } from "./types"

const BASE_URL = "/comment"

const COMMENT_ENDPOINTS = {
  BY_POST: (postId: string) => `/post/${postId}/${BASE_URL}`,
  DETAIL: (commentId: string) => `/${BASE_URL}/${commentId}`,
  LIKE: (commentId: string) => `/${BASE_URL}/${commentId}/like`,
} as const

export const getPostComments = async (postId: string): Promise<GetPostCommentsResponse> => {
  const { data } = await apiClient.get<GetPostCommentsResponse>(COMMENT_ENDPOINTS.BY_POST(postId))
  return data
}

export const createComment = async (
  postId: string,
  payload: CreateCommentRequest,
): Promise<CreateCommentResponse> => {
  const { data } = await apiClient.post<CreateCommentResponse>(
    COMMENT_ENDPOINTS.BY_POST(postId),
    payload,
  )
  return data
}

export const deleteComment = async (commentId: string): Promise<void> => {
  await apiClient.delete(COMMENT_ENDPOINTS.DETAIL(commentId))
}

export const likeComment = async (commentId: string): Promise<void> => {
  await apiClient.post(COMMENT_ENDPOINTS.LIKE(commentId))
}

export const unlikeComment = async (commentId: string): Promise<void> => {
  await apiClient.delete(COMMENT_ENDPOINTS.LIKE(commentId))
}
