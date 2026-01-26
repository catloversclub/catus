import "../global.css";
import "nativewind";
import { useEffect, useState } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router"; // useSegments, useRouter 추가
import { useColorScheme } from "react-native";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { authStorage } from "../lib/auth/storage"; // authStorage 경로 확인 필요

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const router = useRouter();

  // 1. 세션 상태 관리
  const [session, setSession] = useState<any | null>(null);
  const [isReady, setIsReady] = useState(false);

  // 2. 앱 실행 시 SecureStore에서 토큰 확인
  useEffect(() => {
    const checkSession = async () => {
      const savedSession = await authStorage.getSession();
      setSession(savedSession);
      setIsReady(true);
    };
    checkSession();
  }, []);

  // 3. 네비게이션 가드 (로그인 여부에 따른 리다이렉트)
  useEffect(() => {
    if (!isReady) return; // 세션 체크 중이면 대기

    const inAuthGroup = segments[0] === "(auth)";

    // 세션이 없는데, 로그인 화면이 아니라면 -> 로그인 화면으로 보냄
    if (!session && !inAuthGroup) {
      router.replace("/(auth)/login");
    }
    // 세션이 있는데, 로그인 화면에 있다면 -> 메인으로 보냄
    else if (session && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [session, isReady, segments]);

  // 4. 세션 체크 전에는 아무것도 렌더링하지 않음 (스플래시 스크린 유지)
  if (!isReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <Stack>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen
                name="(onboarding)"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="post"
                options={{
                  headerShown: false,
                }}
              />
            </Stack>
          </ThemeProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
