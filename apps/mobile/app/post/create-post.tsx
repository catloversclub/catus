import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

export default function CreatePostScreen() {
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    // TODO: API 호출하여 게시글 업로드
    console.log("게시글 작성:", { imageUri, content });
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* 헤더 */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <Text className="text-lg font-semibold">새 게시물</Text>
      </View>

      <ScrollView className="flex-1">
        {/* 선택된 이미지 */}
        <View className="w-full aspect-square bg-gray-100">
          <Image
            source={{ uri: imageUri }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
        </View>

        {/* 내용 입력 */}
        <View className="p-4">
          <TextInput
            placeholder="문구를 작성하세요..."
            placeholderTextColor="#9ca3af"
            value={content}
            onChangeText={setContent}
            multiline
            className="text-base text-black min-h-[120px]"
            textAlignVertical="top"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
