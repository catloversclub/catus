import { apiClient } from "@/api/client"

import {
  CreateCatRequest,
  CreateCatResponse,
  GetCatByIdResponse,
  GetMyCatsResponse,
  PresignedUrlResponse,
  UpdateCatRequest,
  UpdateCatResponse,
} from "./types"

const CAT_ENDPOINTS = {
  BASE: "/cats",
  DETAIL: (catId: number) => `/cats/${catId}`,
  IMAGE_UPLOAD_URL: (catId: number) => `/cats/${catId}/image/upload-url`,
  IMAGE_UPLOAD: (catId: number) => `/cats/${catId}/image`,
} as const

export const getMyCats = async (): Promise<GetMyCatsResponse> => {
  const { data } = await apiClient.get<GetMyCatsResponse>(CAT_ENDPOINTS.BASE)
  return data
}

export const getCatById = async (catId: number): Promise<GetCatByIdResponse> => {
  const { data } = await apiClient.get<GetCatByIdResponse>(CAT_ENDPOINTS.DETAIL(catId))
  return data
}

export const createCat = async (payload: CreateCatRequest): Promise<CreateCatResponse> => {
  const { data } = await apiClient.post<CreateCatResponse>(CAT_ENDPOINTS.BASE, payload)
  return data
}

export const updateCat = async (
  catId: number,
  payload: UpdateCatRequest,
): Promise<UpdateCatResponse> => {
  const { data } = await apiClient.patch<UpdateCatResponse>(CAT_ENDPOINTS.DETAIL(catId), payload)
  return data
}

export const deleteCat = async (catId: number): Promise<void> => {
  await apiClient.delete(CAT_ENDPOINTS.DETAIL(catId))
}

export const getCatImageUploadUrl = async (catId: number): Promise<PresignedUrlResponse> => {
  const { data } = await apiClient.post<PresignedUrlResponse>(CAT_ENDPOINTS.IMAGE_UPLOAD_URL(catId))
  return data
}

export const uploadCatImage = async (catId: number, imageUrl: string): Promise<void> => {
  await apiClient.post(CAT_ENDPOINTS.IMAGE_UPLOAD(catId), { imageUrl })
}
