import { WebView, WebViewMessageEvent } from "react-native-webview";
import { useRouter } from "expo-router";
import { tokenStorage } from "@/lib/auth/tokenStorage";
import { WEBVIEW_MESSAGE_TYPE } from "@catus/constants";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const router = useRouter();

  const handleMessage = async (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      switch (data.type) {
        case WEBVIEW_MESSAGE_TYPE.LOGIN_SUCCESS: // "LOGIN_SUCCESS"
          const { accessToken, refreshToken, onboardingRequired } =
            data.payload;

          console.log("Login Success:", {
            accessToken,
            refreshToken,
            onboardingRequired,
          });

          await tokenStorage.save(accessToken, refreshToken);

          if (!onboardingRequired) {
            router.replace("/(tabs)");
          }
          // onboardingRequired === true 일 때는 아무것도 안 함 (웹뷰가 /onboarding 페이지로 이동함)
          break;

        case WEBVIEW_MESSAGE_TYPE.ONBOARDING_COMPLETE: // "ONBOARDING_COMPLETE"
          // 온보딩 완료 버튼을 눌렀을 때 비로소 탭으로 이동
          router.replace("/(tabs)");
          break;

        // ... 다른 케이스들 (OPEN_COMMENT_SHEET 등)
      }
    } catch (e) {
      console.error("Bridge Error:", e);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <WebView
        source={{ uri: "https://catus.app/login" }}
        onMessage={handleMessage}
        style={{ flex: 1 }}
      />
    </SafeAreaView>
  );
}
