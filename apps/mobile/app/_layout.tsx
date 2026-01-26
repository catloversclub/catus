import "../global.css";
import "nativewind";
import { useEffect } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { useColorScheme } from "react-native";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
// [중요] 방금 만든 AuthContext에서 가져옵니다. 경로가 맞는지 꼭 확인하세요!
import { AuthProvider, useAuth } from "../lib/auth/AuthContext";

// 1. 내부 컴포넌트 (실질적인 문지기 역할)
// useAuth 훅은 AuthProvider 내부에서만 쓸 수 있기 때문에 컴포넌트를 분리해야 합니다.
function RootLayoutNav() {
  const { session, isLoading } = useAuth(); // 전역 상태 구독
  const segments = useSegments();
  const router = useRouter();
  const colorScheme = useColorScheme();

  // 2. 네비게이션 가드 (로그인 여부에 따른 리다이렉트)
  useEffect(() => {
    if (isLoading) return; // 로딩 중이면 대기

    const inAuthGroup = segments[0] === "(auth)";

    // 세션이 없는데, 로그인 화면이 아니라면 -> 로그인 화면으로
    if (!session && !inAuthGroup) {
      router.replace("/(auth)/login");
    }
    // 세션이 있는데, 로그인 화면에 있다면 -> 메인으로
    else if (session && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [session, isLoading, segments]);

  // 3. 로딩 중에는 아무것도 보여주지 않음 (Splash Screen)
  if (isLoading) {
    return null;
  }

  return (
    <BottomSheetModalProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="post" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </BottomSheetModalProvider>
  );
}

// 4. 최상위 레이아웃 (Providers 감싸기)
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {/* AuthProvider가 가장 바깥쪽(또는 UI Provider 안쪽)에 있어야 합니다 */}
        <AuthProvider>
          <RootLayoutNav />
        </AuthProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
