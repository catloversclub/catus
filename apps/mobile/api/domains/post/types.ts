export interface Post {
  id: string // UUID 형태 (019c190e...)
  content: string
  likeCount: number
  createdAt: string // ISO 8601 날짜 문자열
  updatedAt: string
  authorId: string
  catId: string | null
  author: Author
  cat: Cat
  images: PostImage[]
  isLikedByMe: boolean
  isBookmarkedByMe: boolean
}

export interface Author {
  id: string
  nickname: string
  profileImageUrl: string | null
}

export interface Cat {
  id: string
  name: string
  gender: "FEMALE" | "MALE"
  profileImageUrl: string | null
  birthDate: string
  breed: string
  type: string | null
  createdAt: string
  butlerId: string
}

export interface PostImage {
  id: string
  url: string
  order: number
  postId: string
}

export interface GetFeedParams {
  take?: number
  cursor?: string // UUID 문자열이므로 string 타입
}

export type FeedResponse = Post[]

export interface CreatePostRequest {
  catId?: number
  content: string
  imageUrls?: string[]
}

export type CreatePostResponse = Post

export interface UpdatePostRequest {
  content?: string
  imageUrls?: string[]
}

export type UpdatePostResponse = Post

export interface PresignedUrlResponse {
  uploadUrl: string
  key: string
}
