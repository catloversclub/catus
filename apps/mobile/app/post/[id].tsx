import { useLocalSearchParams, router } from "expo-router";
import { View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { Image } from "expo-image";
import { commonStyles } from "@/constants/common-styles";

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const WEBVIEW_URL = "http://172.30.1.22:3000";

  return (
    <SafeAreaView
      style={commonStyles.container}
      edges={["top", "left", "right"]}
    >
      {/* 헤더 */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <Image
            source={require("@/assets/icons/arrow-left.svg")}
            style={{ width: 24, height: 24 }}
          />
        </TouchableOpacity>
      </View>

      {/* WebView로 post 상세 페이지 표시 */}
      <WebView
        source={{ uri: `${WEBVIEW_URL}/post/${id}` }}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
