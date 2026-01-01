import React, { useRef, useState } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import { commonStyles } from "@/constants/common-styles";

interface WebViewPageProps {
  url: string;
  onMessage: (event: WebViewMessageEvent) => void;
}

export function WebViewPage({ url, onMessage }: WebViewPageProps) {
  const webViewRef = useRef<WebView>(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    webViewRef.current?.reload();
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <WebView
          ref={webViewRef}
          source={{ uri: url }}
          style={commonStyles.webview}
          showsVerticalScrollIndicator={false}
          allowsBackForwardNavigationGestures={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          onMessage={onMessage}
        />
      </ScrollView>
    </View>
  );
}
