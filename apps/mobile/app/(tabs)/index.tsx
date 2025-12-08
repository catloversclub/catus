import React from "react";
import { WebView } from "react-native-webview";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { commonStyles } from "@/constants/common-styles";

export default function App() {
  // 개발 중에는 localhost, 배포 시에는 실제 도메인 사용
  // 주의: Android 에뮬레이터에서는 localhost 대신 'http://10.0.2.2:3000' 사용
  const WEBVIEW_URL = "http://172.30.1.62:3000";

  return (
    <SafeAreaView
      style={commonStyles.container}
      edges={["top", "left", "right"]}
    >
      {/* 상단 상태바 스타일 (Toss는 보통 dark나 auto 사용) */}
      <StatusBar style="auto" />

      <WebView
        source={{ uri: WEBVIEW_URL }}
        style={commonStyles.webview}
        // Toss 느낌의 UX를 위한 필수 설정
        showsVerticalScrollIndicator={false} // 스크롤바 숨기기
        allowsBackForwardNavigationGestures={true} // iOS 제스처 뒤로가기 허용
        bounces={false} // 스크롤 바운스 효과 제거 (웹에서 처리하는 게 깔끔함)
        // 성능 최적화
        javaScriptEnabled={true}
        domStorageEnabled={true}
        // 웹뷰가 로딩되기 전 보여줄 컴포넌트 (스켈레톤 등) 설정 가능
        startInLoadingState={true}
      />
    </SafeAreaView>
  );
}
