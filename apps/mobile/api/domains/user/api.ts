import { apiClient } from "@/api/client"
import { UserProfile } from "./types"

const BASE_URL = "/users"

const USER_ENDPOINTS = {
  PROFILE: `${BASE_URL}/me`,
} as const

// 순수하게 데이터만 가져오는 Fetcher 함수
export const getUserProfile = async (): Promise<UserProfile> => {
  const { data } = await apiClient.get<UserProfile>(USER_ENDPOINTS.PROFILE)
  return data
}
