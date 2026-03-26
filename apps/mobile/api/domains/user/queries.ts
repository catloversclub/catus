import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getUserProfile,
  getUserById,
  checkNickname,
  createUser,
  updateUser,
  deleteUser,
  followUser,
  unfollowUser,
} from "./api"

// 💡 1. 체계적인 Query Key 관리
export const userKeys = {
  all: ["user"] as const,
  me: () => [...userKeys.all, "me"] as const,
  detail: (userId: string) => [...userKeys.all, "detail", userId] as const,
  checkNickname: (nickname: string) => [...userKeys.all, "nickname", nickname] as const,
}

// -----------------------------------------------------
// 💡 2. GET 요청 (useSuspenseQuery 사용)
// -----------------------------------------------------

export const useUserProfileQuery = () => {
  return useSuspenseQuery({
    queryKey: userKeys.me(),
    queryFn: getUserProfile,
  })
}

export const useUserDetailQuery = (userId: string) => {
  return useSuspenseQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => getUserById(userId),
  })
}

export const useCheckNicknameQuery = (nickname: string) => {
  return useSuspenseQuery({
    queryKey: userKeys.checkNickname(nickname),
    queryFn: () => checkNickname(nickname),
  })
}

// -----------------------------------------------------
// 💡 3. POST/PATCH/DELETE 요청 (useMutation 사용)
// -----------------------------------------------------

export const useCreateUserMutation = () => {
  return useMutation({ mutationFn: createUser })
}

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      // 내 정보가 업데이트되면 캐시 무효화하여 최신 데이터 다시 불러오기
      queryClient.invalidateQueries({ queryKey: userKeys.me() })
    },
  })
}

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.clear() // 탈퇴 시 모든 캐시 초기화 등 처리
    },
  })
}

export const useFollowUserMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => followUser(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) })
      // 필요 시 팔로잉 피드 등 무효화
    },
  })
}

export const useUnfollowUserMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => unfollowUser(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) })
    },
  })
}
