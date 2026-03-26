import { useFonts } from "expo-font"
import { Stack, useRouter } from "expo-router"
import { PortalHost } from "@rn-primitives/portal"
import * as SplashScreen from "expo-splash-screen"
import { useEffect, useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useReactQueryDevTools } from "@dev-plugins/react-query"
import * as SecureStore from "expo-secure-store"
import "../styles/global.css"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // 실패 시 1번 더 재시도
      refetchOnWindowFocus: false, // 앱 화면으로 돌아왔을 때 자동 새로고침 여부 (RN에서는 false 권장)
    },
  },
})

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  useReactQueryDevTools(queryClient)

  const router = useRouter()

  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    async function doAsyncStuff() {
      try {
        await useFonts({
          SpaceMono: require("@/assets/fonts/PretendardVariable.ttf"),
        })
        const token = await SecureStore.getItemAsync("accessToken")
        if (token) {
          // 토큰이 존재하면 탭 화면으로 강제 이동
          // (setTimeout을 약간 주는 것은 Expo Router 초기화 타이밍 이슈 방지용)
          setTimeout(() => {
            router.replace("/(tabs)")
          }, 0)
        }
      } catch (e) {
        console.warn(e)
      } finally {
        // 3. 검사가 모두 끝나면 앱 렌더링을 허용하고 스플래시 화면을 숨깁니다.
        setIsReady(true)
        await SplashScreen.hideAsync()
      }
    }

    doAsyncStuff()
  }, [])

  if (!isReady) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="post" />
      </Stack>
      <PortalHost />
    </QueryClientProvider>
  )
}
