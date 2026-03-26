// src/api/client.ts
import { API_BASE_URL } from "@/constants/api"
import axios from "axios"
import * as SecureStore from "expo-secure-store"

// 🌟 1. 토큰이 필요 없는 공개 API용 인스턴스 (로그인, 회원가입 등)
export const publicClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// 🌟 2. 토큰이 필요한 인증 API용 인스턴스 (기존 코드와 동일)
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// 토큰 갱신 진행 여부 및 대기열 관리
let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

// 대기 중인 요청들을 실행하는 함수
const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token))
  refreshSubscribers = [] // 실행 후 대기열 비우기
}

// 갱신 중일 때 들어온 요청을 대기열에 추가하는 함수
const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback)
}

// 1. Request Interceptor (요청 시 토큰 삽입)
apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("accessToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 2. Response Interceptor (토큰 만료 처리)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // 401 에러(권한 없음) 발생 & 이전에 재시도한 적 없는 요청일 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true // 무한 루프 방지용 플래그

      // 토큰 갱신 중이 아니라면 갱신 시작
      if (!isRefreshing) {
        isRefreshing = true
        try {
          const refreshToken = await SecureStore.getItemAsync("refreshToken")

          if (!refreshToken) {
            throw new Error("Refresh Token이 없습니다.")
          }

          // 새로운 토큰 발급 요청 (엔드포인트는 실제 서버 주소에 맞게 변경)
          // 주의: apiClient를 쓰면 인터셉터에 무한 루프가 걸릴 수 있어 별도의 axios 인스턴스 사용
          const { data } = await axios.post("https://api.yourdomain.com/auth/refresh", {
            refreshToken,
          })

          const newAccessToken = data.accessToken
          const newRefreshToken = data.refreshToken // 서버가 리프레시 토큰도 새로 준다면 갱신

          // 새 토큰을 SecureStore에 저장
          await SecureStore.setItemAsync("accessToken", newAccessToken)
          if (newRefreshToken) {
            await SecureStore.setItemAsync("refreshToken", newRefreshToken)
          }

          // 갱신 성공 처리
          isRefreshing = false
          onTokenRefreshed(newAccessToken)

          // 실패했던 원래 요청에 새 토큰을 달아서 재시도
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return apiClient(originalRequest)
        } catch (refreshError) {
          // 리프레시 토큰마저 만료되었거나 유효하지 않은 경우 -> 완전히 로그아웃 처리
          isRefreshing = false
          await SecureStore.deleteItemAsync("accessToken")
          await SecureStore.deleteItemAsync("refreshToken")

          // TODO: 전역 상태 초기화 및 로그인 화면으로 리다이렉트 (예: expo-router의 router.replace('/login'))

          return Promise.reject(refreshError)
        }
      }

      // 이미 토큰 갱신이 진행 중이라면, 대기열에 Promise를 넣어두고 갱신이 끝나면 실행되도록 함
      return new Promise((resolve) => {
        addRefreshSubscriber((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          resolve(apiClient(originalRequest))
        })
      })
    }

    // 401 에러가 아니거나, 이미 재시도했던 요청이면 그대로 에러 반환
    return Promise.reject(error)
  },
)
