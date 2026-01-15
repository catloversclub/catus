import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Image as RNImage,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Image } from "expo-image";
import * as ImageManipulator from "expo-image-manipulator";
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CANVAS_SIZE = SCREEN_WIDTH; // 이미지가 표시되는 영역

export default function EditorScreen() {
  const { uri } = useLocalSearchParams<{ uri: string; index: string }>();
  const [currentMode, setCurrentMode] = useState<
    "none" | "crop" | "mosaic" | "text"
  >("none");
  const [currentUri, setCurrentUri] = useState(uri);

  // 1. 크롭 박스 제스처 상태값
  const boxX = useSharedValue(50);
  const boxY = useSharedValue(50);
  const boxWidth = useSharedValue(200);
  const boxHeight = useSharedValue(200);

  // 2. 제스처 정의
  const moveGesture = Gesture.Pan().onChange((e) => {
    boxX.value += e.changeX;
    boxY.value += e.changeY;
  });

  const resizeGesture = Gesture.Pan().onChange((e) => {
    boxWidth.value = Math.max(50, boxWidth.value + e.changeX);
    boxHeight.value = Math.max(50, boxHeight.value + e.changeY);
  });

  const boxStyle = useAnimatedStyle(() => ({
    top: boxY.value,
    left: boxX.value,
    width: boxWidth.value,
    height: boxHeight.value,
  }));

  // 3. 실제 자르기 실행 (Scale 계산 포함)
  const handleCropComplete = async () => {
    // 원본 이미지 정보 가져오기
    await new Promise<{ width: number; height: number }>((resolve, reject) => {
      RNImage.getSize(
        currentUri,
        (width, height) => resolve({ width, height }),
        reject
      );
    }).then(async (asset) => {
      const scale = asset.width / CANVAS_SIZE; // 화면 대비 원본 비율

      const cropConfig = {
        originX: boxX.value * scale,
        originY: boxY.value * scale,
        width: boxWidth.value * scale,
        height: boxHeight.value * scale,
      };

      const result = await ImageManipulator.manipulateAsync(
        currentUri,
        [{ crop: cropConfig }],
        { format: ImageManipulator.SaveFormat.JPEG }
      );

      setCurrentUri(result.uri);
      setCurrentMode("none");
    });
  };

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
            : currentMode === "crop"
              ? "자르기"
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
      <View
        style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
        className="relative self-center"
      >
        <Image
          source={{ uri: currentUri }}
          style={StyleSheet.absoluteFill}
          contentFit="contain"
        />

        {currentMode === "crop" && (
          <>
            {/* 어두운 배경 */}
            <View style={StyleSheet.absoluteFill} className="bg-black/60" />

            {/* 크롭 박스 */}
            <GestureDetector gesture={moveGesture}>
              <Animated.View style={[styles.cropBox, boxStyle]}>
                {/* 격자 무늬 */}
                <View className="flex-1 border border-white/50 flex-row">
                  <View className="flex-1 border-r border-white/20" />
                  <View className="flex-1 border-r border-white/20" />
                  <View className="flex-1" />
                </View>

                {/* 크기 조절 핸들 (우측 하단) */}
                <GestureDetector gesture={resizeGesture}>
                  <View style={styles.handle} />
                </GestureDetector>
              </Animated.View>
            </GestureDetector>
          </>
        )}
      </View>

      {/* 하단 툴바 */}
      <View className="flex-1 justify-end pb-10">
        {currentMode === "none" ? (
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
        ) : (
          <View className="p-6 bg-zinc-900">
            {currentMode === "crop" && (
              <View>
                <Text className="text-white text-center mb-4">
                  영역을 드래그하여 조절하세요
                </Text>
                <TouchableOpacity
                  onPress={handleCropComplete}
                  className="bg-yellow-400 py-4 rounded-lg"
                >
                  <Text className="text-center font-bold">자르기 적용</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  cropBox: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "transparent",
  },
  handle: {
    position: "absolute",
    right: -10,
    bottom: -10,
    width: 30,
    height: 30,
    backgroundColor: "#fff",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#000",
  },
});
