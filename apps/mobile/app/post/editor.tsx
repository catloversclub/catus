import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Image } from "expo-image";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CropTool from "@/components/post/CropTool";
import MosaicTool from "@/components/post/MosaicTool";
import TextTool from "@/components/post/TextTool";

export default function EditorScreen() {
  const { uri } = useLocalSearchParams<{ uri: string; index: string }>();
  const [currentMode, setCurrentMode] = useState<
    "none" | "crop" | "mosaic" | "text"
  >("none");
  const [currentUri, setCurrentUri] = useState(uri);

  // 수정 완료 핸들러
  const handleEditSave = (editedUri: string) => {
    setCurrentUri(editedUri);
    setCurrentMode("none");
  };

  // 크롭 모드일 때는 CropTool 컴포넌트 사용
  if (currentMode === "crop") {
    return (
      <CropTool
        uri={currentUri}
        onSave={handleEditSave}
        onCancel={() => setCurrentMode("none")}
      />
    );
  }
  if (currentMode === "mosaic") {
    return (
      <MosaicTool
        uri={currentUri}
        onSave={handleEditSave}
        onCancel={() => setCurrentMode("none")}
      />
    );
  }
  if (currentMode === "text") {
    return (
      <TextTool
        uri={currentUri}
        onSave={handleEditSave}
        onCancel={() => setCurrentMode("none")}
      />
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#000" }}>
      {/* 헤더 */}
      <View className="flex-row justify-between items-center p-4 pt-12">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-white">취소</Text>
        </TouchableOpacity>
        <Text className="text-white font-bold">
          {currentMode === "none"
            ? "이미지 편집"
            : currentMode === "mosaic"
              ? "모자이크"
              : "텍스트"}
        </Text>
        <TouchableOpacity
          onPress={() => {
            /* 전체 저장 로직 */
          }}
        >
          <Text className="text-yellow-400">완료</Text>
        </TouchableOpacity>
      </View>

      {/* 메인 캔버스 */}
      <View className="flex-1 justify-center items-center">
        <Image
          source={{ uri: currentUri }}
          style={{ width: "100%", height: "100%" }}
          contentFit="contain"
        />
      </View>

      {/* 하단 툴바 */}
      <View className="flex-row justify-around p-6 bg-zinc-900">
        <TouchableOpacity onPress={() => setCurrentMode("crop")}>
          <Text className="text-white">자르기</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentMode("mosaic")}>
          <Text className="text-white">모자이크</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentMode("text")}>
          <Text className="text-white">텍스트</Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
}
