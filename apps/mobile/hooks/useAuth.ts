import { login } from "@react-native-seoul/kakao-login";
import {
  GoogleSignin,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from "expo-apple-authentication";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";
import { useRouter } from "expo-router"; // 👈 추가된 부분

type AuthProvider = "kakao" | "google" | "apple";

type OidcExchangeResponse = {
  onboardingRequired: boolean;
  accessToken: string;
  refreshToken: string | null;
};

const API_BASE_URL = "https://api.catus.app";

// 구글 설정 (그대로 유지)
GoogleSignin.configure({
  webClientId: process.env.GOOGLE_WEB_CLIENT_ID,
  iosClientId: process.env.GOOGLE_IOS_CLIENT_ID,
});

export const useAuth = () => {
  const router = useRouter(); // 👈 공유할 라우터 객체 생성

  // 🌟 추가: 앱 시작 시 이미 로그인되어 있는지 확인하는 함수
  const checkInitialAuth = async () => {
    try {
      const token = await SecureStore.getItemAsync("accessToken");
      if (token) {
        // 토큰이 존재하면 로그인 화면을 건너뛰고 바로 메인 홈으로 이동
        console.log("[auth] 기존 토큰 발견, 홈으로 이동합니다.");
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.error("[auth] 토큰 확인 중 에러:", error);
    }
  };

  const signIn = async (provider: AuthProvider) => {
    try {
      let idToken: string | null = null;

      // ... (기존 1, 2번 로직 동일하게 유지) ...
      switch (provider) {
        case "kakao":
          const kakaoRes = await login();
          idToken = kakaoRes.idToken;
          break;
        case "google":
          await GoogleSignin.hasPlayServices();
          const googleRes = await GoogleSignin.signIn();
          if (isSuccessResponse(googleRes)) {
            idToken = googleRes.data.idToken;
          }
          break;
        case "apple":
          const appleRes = await AppleAuthentication.signInAsync({
            requestedScopes: [
              AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
              AppleAuthentication.AppleAuthenticationScope.EMAIL,
            ],
          });
          idToken = appleRes.identityToken;
          break;
      }

      if (!idToken)
        throw new Error(`${provider}의 idToken을 가져오지 못했습니다.`);

      const res = await fetch(`${API_BASE_URL}/auth/oidc/exchange`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, provider }),
      });

      if (!res.ok) throw new Error("서버 OIDC 교환 실패");

      // 3. 토큰 저장
      const exchanged: OidcExchangeResponse = await res.json();
      await SecureStore.setItemAsync("accessToken", exchanged.accessToken);
      if (exchanged.refreshToken) {
        await SecureStore.setItemAsync("refreshToken", exchanged.refreshToken);
      }

      // 🌟 4. 백엔드 응답에 따른 라우팅 처리 (수정된 부분)
      if (exchanged.onboardingRequired) {
        console.log("온보딩(회원가입) 화면으로 이동합니다.");
        router.replace("/(onboarding)"); // 뒤로가기 방지를 위해 push 대신 replace 사용
      } else {
        console.log("메인 홈 화면으로 이동합니다.");
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.error(`[auth] ${provider} login failed`, error);
      Alert.alert("로그인 실패", "다시 시도해주세요.");
    }
  };

  // checkInitialAuth를 반환 객체에 추가
  return { signIn, checkInitialAuth };
};
