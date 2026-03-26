import { useMutation, useQueryClient } from "@tanstack/react-query"
import { login as kakaoLogin } from "@react-native-seoul/kakao-login"
import { GoogleSignin, isSuccessResponse } from "@react-native-google-signin/google-signin"
import * as AppleAuthentication from "expo-apple-authentication"
import * as SecureStore from "expo-secure-store"
import { router } from "expo-router"
import { Alert } from "react-native"

import { AuthProvider } from "./types"
import { exchangeOidcToken, logoutUser } from "./api"

// 앱 최상단이나 초기화 파일에 위치하는 것이 좋지만, 응집도를 위해 여기에 둘 수도 있습니다.
GoogleSignin.configure({
  webClientId: process.env.GOOGLE_WEB_CLIENT_ID,
  iosClientId: process.env.GOOGLE_IOS_CLIENT_ID,
})

export const useLogin = () => {
  return useMutation({
    // 1. mutationFn: 핵심 로직 실행 (토큰 발급 및 서버 교환)
    mutationFn: async (provider: AuthProvider) => {
      let idToken: string | null = null

      switch (provider) {
        case "kakao":
          const kakaoRes = await kakaoLogin()
          idToken = kakaoRes.idToken
          break
        case "google":
          await GoogleSignin.hasPlayServices()
          const googleRes = await GoogleSignin.signIn()
          if (isSuccessResponse(googleRes)) {
            idToken = googleRes.data.idToken
          }
          break
        case "apple":
          const appleRes = await AppleAuthentication.signInAsync({
            requestedScopes: [
              AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
              AppleAuthentication.AppleAuthenticationScope.EMAIL,
            ],
          })
          idToken = appleRes.identityToken
          break
      }

      if (!idToken) throw new Error(`${provider}의 idToken을 가져오지 못했습니다.`)

      // API 호출 (api.ts에 정의된 함수 사용)
      return await exchangeOidcToken({ idToken, provider })
    },

    // 2. onSuccess: mutationFn이 성공적으로 끝났을 때의 후처리
    onSuccess: async (data) => {
      await SecureStore.setItemAsync("accessToken", data.accessToken)
      if (data.refreshToken) {
        await SecureStore.setItemAsync("refreshToken", data.refreshToken)
      }

      if (data.onboardingRequired) {
        router.replace("/(onboarding)/step1")
      } else {
        router.replace("/(tabs)")
      }
    },

    // 3. onError: 에러 발생 시 처리
    onError: (error: any) => {
      console.error("[Login Mutation Error]:", error.response?.data || error.message)
      Alert.alert("로그인 실패", "다시 시도해주세요.")
    },
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const refreshToken = await SecureStore.getItemAsync("refreshToken")
      if (refreshToken) {
        await logoutUser(refreshToken)
      }
    },
    // 🌟 onSettled: 성공하든 실패하든(백엔드 서버가 죽어있더라도) 무조건 실행됨
    onSettled: async () => {
      await SecureStore.deleteItemAsync("accessToken")
      await SecureStore.deleteItemAsync("refreshToken")

      // 모든 캐시 무효화 (다른 유저 정보 노출 방지)
      queryClient.clear()

      router.replace("/")
    },
  })
}
