import { View, TextInput, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, router } from "expo-router";
import { useMemo, useRef, useState } from "react";
import PagerView from "react-native-pager-view";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function CreatePostScreen() {
  const { imageUris } = useLocalSearchParams<{
    imageUris: string;
  }>();
  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 상태

  // JSON 문자열로 전달된 imageUris를 파싱
  const images = useMemo(() => {
    if (!imageUris) return [];
    try {
      return JSON.parse(imageUris) as string[];
    } catch {
      return [];
    }
  }, [imageUris]);

  const pages = images.map((_, index) => index); // 실제 이미지 개수에 맞춤
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    // TODO: API 호출하여 게시글 업로드
    console.log("게시글 작성:", { imageUris, content });
    router.back();
  };
  return (
    <KeyboardAwareScrollView>
      <View className="flex-1 bg-white">
        <PagerView
          style={{
            height: 300,
            paddingHorizontal: 12,
          }}
          initialPage={0}
          ref={pagerRef}
          onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
        >
          {images.map((uri, index) => (
            <View
              className="w-full h-full justify-center items-center"
              key={index}
            >
              <Image
                source={{ uri }}
                style={{ width: "100%", height: 300 }}
                contentFit="contain"
              />
            </View>
          ))}
        </PagerView>
        {/* 페이지 인디케이터 - PagerView 바깥에 배치 */}
        <View className="mt-[200px] flex-row justify-center items-center">
          {pages.map((pageIndex) => (
            <TouchableOpacity
              key={pageIndex}
              className={`w-2.5 h-2.5 rounded-full mx-1.5 ${
                currentPage === pageIndex
                  ? "bg-gray-700 w-3 h-3"
                  : "bg-gray-300"
              }`}
              onPress={() => pagerRef.current?.setPage(pageIndex)}
            />
          ))}
        </View>
        {/* 내용 입력 */}
        <View className="p-4 mb-10">
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

        {/* PagerView + 인디케이터 wrapper */}
      </View>
    </KeyboardAwareScrollView>
  );
}
