import { WEBVIEW_MESSAGE_TYPE } from "@catus/constants";
import React, { useState, useRef, useCallback } from "react";
import { WebViewMessageEvent } from "react-native-webview";
import { SafeAreaView } from "react-native-safe-area-context";

import { FeedHeader } from "@/components/layout/feed-header";
import { WebViewPage } from "@/components/webview-page";
import PagerView from "react-native-pager-view";
import { TabType } from "@/constants/type";
import { commonStyles } from "@/constants/common-styles";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import BottomSheet from "@/components/bottom-sheet";
import { Text } from "react-native";

export default function App() {
  const WEBVIEW_URL = "http://192.168.0.172:3000";

  const pagerRef = useRef<PagerView>(null);
  const commentSheetRef = useRef<BottomSheetModal>(null);
  const additionSheetRef = useRef<BottomSheetModal>(null);

  const [activeTab, setActiveTab] = useState(0); // 0: following, 1: recommended

  const handleTabChange = (tab: TabType) => {
    const index = tab === "following" ? 0 : 1;
    setActiveTab(index);
    pagerRef.current?.setPage(index);
  };

  const handleWebViewMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.type === WEBVIEW_MESSAGE_TYPE.OPEN_COMMENT_SHEET) {
        handlePresentModalPress();
      }
      if (data.type === WEBVIEW_MESSAGE_TYPE.OPEN_ADDITION_SHEET) {
        handleadditionModalPress();
      }
    } catch (error) {
      console.error("Failed to parse message from WebView:", error);
    }
  };

  const handlePresentModalPress = useCallback(() => {
    commentSheetRef.current?.present(); // .present()를 호출해야 함
  }, []);
  const handleadditionModalPress = useCallback(() => {
    additionSheetRef.current?.present(); // .present()를 호출해야 함
  }, []);

  return (
    <SafeAreaView
      style={commonStyles.container}
      edges={["top", "left", "right"]}
    >
      <FeedHeader
        activeTab={activeTab === 0 ? "following" : "recommended"}
        onTabChange={handleTabChange}
      />

      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0}
        onPageSelected={(e) => setActiveTab(e.nativeEvent.position)}
      >
        <WebViewPage
          key="0"
          url={WEBVIEW_URL + "/following"}
          onMessage={handleWebViewMessage}
        />
        <WebViewPage
          key="1"
          url={WEBVIEW_URL + "/recommended"}
          onMessage={handleWebViewMessage}
        />
      </PagerView>
      <BottomSheet ref={commentSheetRef} index={1}>
        <Text>이제 탭 바 위로 올라옵니다! 🎉</Text>
      </BottomSheet>
      <BottomSheet ref={additionSheetRef} index={1}>
        <Text>이제 탭 바 위로 올라옵니다! 🎉</Text>
      </BottomSheet>
    </SafeAreaView>
  );
}
