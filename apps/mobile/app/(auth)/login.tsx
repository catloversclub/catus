import React from "react";
import { StyleSheet } from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import { useRouter } from "expo-router";
import { authStorage } from "../../lib/auth/storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { WEBVIEW_MESSAGE_TYPE } from "@catus/constants";

export default function LoginScreen() {
  const router = useRouter();

  const TARGET_URL = "/post-login";

  // 1. 로그인 직후 토큰을 긁어오기 위한 스크립트 (이전과 동일)
  const INJECTED_JAVASCRIPT = `
    (function() {
      if (window.location.href.includes('${TARGET_URL}')) {
        const bodyText = document.body.innerText;
        window.ReactNativeWebView.postMessage(bodyText);
      }
    })();
    true;
  `;

  // 2. 메시지 핸들러 (로직 변경됨!)
  const handleMessage = async (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log("Webview Message:", data);

      // 1. [로그인 성공 처리]
      // /post-login 페이지에서 긁어온 데이터에는 type 필드가 없고 바로 accessToken이 있을 수 있음
      // 따라서 accessToken 유무로 판단하거나 구조를 통일해야 함.
      if (data.accessToken) {
        // ... (기존 저장 로직 동일) ...
        await authStorage.saveSession(
          data.accessToken,
          data.refreshToken,
          data.user,
        );

        // if (!data.onboardingRequired) {
        router.replace("/(tabs)");
        // }
        return; // 여기서 함수 종료
      }

      // 2. [온보딩 완료 처리] - 만들어두신 sendToReactNative 구조 활용
      // 구조: { type: ONBOARDING_COMPLETE, payload: undefined }
      if (data.type === WEBVIEW_MESSAGE_TYPE.ONBOARDING_COMPLETE) {
        console.log("온보딩 완료! 메인으로 이동합니다.");

        // (선택) 로컬 세션의 onboardingRequired 업데이트
        const session = await authStorage.getSession();
        if (session) {
          const updatedUser = { ...session.user, onboardingRequired: false };
          await authStorage.saveSession(
            session.accessToken,
            session.refreshToken,
            updatedUser,
          );
        }

        router.replace("/(tabs)");
      }
    } catch (e) {
      // console.log("JSON Parse Error");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{ uri: "https://catus.app/login" }}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        onMessage={handleMessage}
        sharedCookiesEnabled={true}
        // iOS에서 스와이프로 뒤로가기 방지 (온보딩 중 이탈 방지)
        allowsBackForwardNavigationGestures={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
