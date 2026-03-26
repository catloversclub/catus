import { apiClient } from "@/api/client"

import {
  CreatePostRequest,
  CreatePostResponse,
  FeedResponse,
  GetFeedParams,
  Post,
  PresignedUrlResponse,
  UpdatePostRequest,
  UpdatePostResponse,
} from "./types"
import { POST_PAGINATION } from "@/constants/posts"

const BASE_URL = "/post"

const POST_ENDPOINTS = {
  BASE: BASE_URL,
  DETAIL: (postId: string) => `${BASE_URL}/${postId}`,
  CAT_POSTS: (catId: string) => `${BASE_URL}/cats/${catId}`,
  USER_POSTS: (userId: string) => `${BASE_URL}/users/${userId}`,
  MY_POSTS: `${BASE_URL}/me`,
  FOLLOWING_FEED: `${BASE_URL}/feed`,
  RECOMMENDED_FEED: `${BASE_URL}/feed/?type=recommended`,
  LIKE: (postId: string) => `${BASE_URL}/${postId}/like`,
  BOOKMARK: (postId: string) => `${BASE_URL}/${postId}/bookmark`,
  IMAGE_UPLOAD_URL: `${BASE_URL}/image/upload-url`,
  IMAGE_UPLOAD: `${BASE_URL}/image`,
} as const

export const createPost = async (payload: CreatePostRequest): Promise<CreatePostResponse> => {
  const { data } = await apiClient.post<CreatePostResponse>(POST_ENDPOINTS.BASE, payload)
  return data
}

export const updatePost = async (
  postId: string,
  payload: UpdatePostRequest,
): Promise<UpdatePostResponse> => {
  const { data } = await apiClient.patch<UpdatePostResponse>(POST_ENDPOINTS.DETAIL(postId), payload)
  return data
}

export const deletePost = async (postId: string): Promise<void> => {
  await apiClient.delete(POST_ENDPOINTS.DETAIL(postId))
}

export const getPostById = async (postId: string): Promise<Post> => {
  const { data } = await apiClient.get<Post>(POST_ENDPOINTS.DETAIL(postId))
  return data
}

export const getCatPosts = async (catId: string): Promise<FeedResponse> => {
  const { data } = await apiClient.get<FeedResponse>(POST_ENDPOINTS.CAT_POSTS(catId))
  return data
}

export const getFollowingFeed = async ({
  take = POST_PAGINATION.DEFAULT_TAKE,
  cursor,
}: GetFeedParams = {}): Promise<FeedResponse> => {
  const { data } = await apiClient.get<FeedResponse>(POST_ENDPOINTS.FOLLOWING_FEED, {
    params: {
      take,
      cursor,
    },
  })
  return data
}

export const getMyPosts = async (): Promise<FeedResponse> => {
  const { data } = await apiClient.get<FeedResponse>(POST_ENDPOINTS.MY_POSTS)
  return data
}

export const getRecommendedFeed = async ({
  take = POST_PAGINATION.DEFAULT_TAKE,
  cursor,
}: GetFeedParams = {}): Promise<FeedResponse> => {
  const { data } = await apiClient.get<FeedResponse>(POST_ENDPOINTS.RECOMMENDED_FEED, {
    params: {
      take,
      cursor,
    },
  })
  return data
}

export const getUserPosts = async (userId: string): Promise<FeedResponse> => {
  const { data } = await apiClient.get<FeedResponse>(POST_ENDPOINTS.USER_POSTS(userId))
  return data
}

export const likePost = async (postId: string): Promise<void> => {
  await apiClient.post(POST_ENDPOINTS.LIKE(postId))
}

export const unlikePost = async (postId: string): Promise<void> => {
  await apiClient.delete(POST_ENDPOINTS.LIKE(postId))
}

export const bookmarkPost = async (postId: string): Promise<void> => {
  await apiClient.post(POST_ENDPOINTS.BOOKMARK(postId))
}

export const unbookmarkPost = async (postId: string): Promise<void> => {
  await apiClient.delete(POST_ENDPOINTS.BOOKMARK(postId))
}

export const getPostImageUploadUrl = async (): Promise<PresignedUrlResponse> => {
  const { data } = await apiClient.post<PresignedUrlResponse>(POST_ENDPOINTS.IMAGE_UPLOAD_URL)
  return data
}

export const uploadPostImage = async (imageUrl: string): Promise<void> => {
  await apiClient.post(POST_ENDPOINTS.IMAGE_UPLOAD, { imageUrl })
}
