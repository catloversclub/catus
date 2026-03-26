import { apiClient } from "@/api/client"

import { GetAppearanceResponse, GetPersonalityResponse } from "./types"

const ATTRIBUTE_ENDPOINTS = {
  APPEARANCE: "/attributes/appearance",
  PERSONALITY: "/attributes/personality",
} as const

export const getAppearance = async (): Promise<GetAppearanceResponse> => {
  const { data } = await apiClient.get<GetAppearanceResponse>(ATTRIBUTE_ENDPOINTS.APPEARANCE)
  return data
}

export const getPersonality = async (): Promise<GetPersonalityResponse> => {
  const { data } = await apiClient.get<GetPersonalityResponse>(ATTRIBUTE_ENDPOINTS.PERSONALITY)
  return data
}
