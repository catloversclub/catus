export interface Cat {
  catId: number
  name: string
  profileImageUrl?: string
}

export interface GetMyCatsResponse {
  cats: Cat[]
}

export type GetCatByIdResponse = Cat

export interface CreateCatRequest {
  name: string
  appearanceIds?: number[]
  personalityIds?: number[]
}

export type CreateCatResponse = Cat

export interface UpdateCatRequest {
  name?: string
  appearanceIds?: number[]
  personalityIds?: number[]
}

export type UpdateCatResponse = Cat

export interface PresignedUrlResponse {
  uploadUrl: string
  key: string
}
