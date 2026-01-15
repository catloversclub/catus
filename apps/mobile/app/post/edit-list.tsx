// ... 기존 import에 추가
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useRef } from "react";

import { Pressable, View, Text } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import PagerView from "react-native-pager-view";
import { Image } from "expo-image";

export default function EditListScreen() {
  // ... 기존 images 파싱 로직
  const { imageUris } = useLocalSearchParams<{
    imageUris: string;
  }>();

  const pagerRef = useRef<PagerView>(null);

  // JSON 문자열로 전달된 imageUris를 파싱

  const images = useMemo(() => {
    if (!imageUris) return [];

    try {
      return JSON.parse(imageUris) as string[];
    } catch {
      return [];
    }
  }, [imageUris]);

  const handleEditImage = (uri: string, index: number) => {
    router.push({
      pathname: "/post/editor",
      params: { uri, index }, // 어떤 이미지를 수정할지 전달
    });
  };

  return (
    <KeyboardAwareScrollView>
      <View className="flex-1 bg-white">
        <PagerView ref={pagerRef} style={{ height: 400 }}>
          {images.map((uri, index) => (
            <Pressable key={index} onPress={() => handleEditImage(uri, index)}>
              <View className="items-center justify-center">
                <Image
                  source={{ uri }}
                  style={{ width: "90%", height: 350, borderRadius: 8 }}
                />
                <View className="absolute bottom-4 right-8 bg-black/50 p-2 rounded">
                  <Text className="text-white text-xs">터치하여 편집</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </PagerView>
        {/* ... 인디케이터 및 TextInput 로직 */}
      </View>
    </KeyboardAwareScrollView>
  );
}
