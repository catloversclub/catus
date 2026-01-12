import { WEBVIEW_URL } from "@/constants/dummy";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { WebView } from "react-native-webview";

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* WebView로 post 상세 페이지 표시 */}
      <WebView
        source={{ uri: `${WEBVIEW_URL}/post/${id}` }}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
