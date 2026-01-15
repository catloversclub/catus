import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Image as RNImage,
} from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
import { Image } from "expo-image";
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
const CANVAS_SIZE = SCREEN_WIDTH;

interface CropToolProps {
  uri: string;
  onSave: (editedUri: string) => void;
  onCancel: () => void;
}

export default function CropTool({ uri, onSave, onCancel }: CropToolProps) {
  // 1. 현재 선택된 비율 상태
  const [aspectRatio, setAspectRatio] = useState("자유");

  // 2. 크롭 박스 제스처 상태값
  const boxX = useSharedValue(50);
  const boxY = useSharedValue(50);
  const boxWidth = useSharedValue(CANVAS_SIZE - 100);
  const boxHeight = useSharedValue(CANVAS_SIZE - 100);

  // 3. 비율 선택 시 크롭 박스 조정
  useEffect(() => {
    const centerX = (CANVAS_SIZE - boxWidth.value) / 2;
    const centerY = (CANVAS_SIZE - boxHeight.value) / 2;

    switch (aspectRatio) {
      case "1:1":
        const size = Math.min(
          CANVAS_SIZE - 100,
          boxWidth.value,
          boxHeight.value
        );
        boxWidth.value = size;
        boxHeight.value = size;
        break;
      case "3:2":
        boxWidth.value = CANVAS_SIZE - 100;
        boxHeight.value = (boxWidth.value * 2) / 3;
        break;
      case "4:3":
        boxWidth.value = CANVAS_SIZE - 100;
        boxHeight.value = (boxWidth.value * 3) / 4;
        break;
      case "16:9":
        boxWidth.value = CANVAS_SIZE - 100;
        boxHeight.value = (boxWidth.value * 9) / 16;
        break;
      default:
        // 자유 비율은 현재 상태 유지
        break;
    }

    boxX.value = (CANVAS_SIZE - boxWidth.value) / 2;
    boxY.value = (CANVAS_SIZE - boxHeight.value) / 2;
  }, [aspectRatio]);

  // 4. 제스처 정의
  const moveGesture = Gesture.Pan().onChange((e) => {
    const newX = boxX.value + e.changeX;
    const newY = boxY.value + e.changeY;

    // 경계 체크
    if (newX >= 0 && newX + boxWidth.value <= CANVAS_SIZE) {
      boxX.value = newX;
    }
    if (newY >= 0 && newY + boxHeight.value <= CANVAS_SIZE) {
      boxY.value = newY;
    }
  });

  const resizeGesture = Gesture.Pan().onChange((e) => {
    const newWidth = Math.max(50, boxWidth.value + e.changeX);
    const newHeight = Math.max(50, boxHeight.value + e.changeY);

    // 비율 유지
    if (aspectRatio !== "자유") {
      const ratioMap: { [key: string]: number } = {
        "1:1": 1,
        "3:2": 3 / 2,
        "4:3": 4 / 3,
        "16:9": 16 / 9,
      };
      const ratio = ratioMap[aspectRatio];

      if (ratio) {
        const avgChange = (e.changeX + e.changeY) / 2;
        boxWidth.value = Math.max(
          50,
          Math.min(CANVAS_SIZE - boxX.value, boxWidth.value + avgChange)
        );
        boxHeight.value = boxWidth.value / ratio;
      }
    } else {
      // 자유 비율일 때는 경계 체크만
      if (boxX.value + newWidth <= CANVAS_SIZE) {
        boxWidth.value = newWidth;
      }
      if (boxY.value + newHeight <= CANVAS_SIZE) {
        boxHeight.value = newHeight;
      }
    }
  });

  const boxStyle = useAnimatedStyle(() => ({
    top: boxY.value,
    left: boxX.value,
    width: boxWidth.value,
    height: boxHeight.value,
  }));

  // 5. 실제 자르기 실행 (Scale 계산 포함)
  const handleCrop = async () => {
    // 원본 이미지 정보 가져오기
    await new Promise<{ width: number; height: number }>((resolve, reject) => {
      RNImage.getSize(
        uri,
        (width, height) => resolve({ width, height }),
        reject
      );
    })
      .then(async (asset) => {
        const scale = asset.width / CANVAS_SIZE; // 화면 대비 원본 비율

        const cropConfig = {
          originX: Math.round(boxX.value * scale),
          originY: Math.round(boxY.value * scale),
          width: Math.round(boxWidth.value * scale),
          height: Math.round(boxHeight.value * scale),
        };

        const result = await ImageManipulator.manipulateAsync(
          uri,
          [{ crop: cropConfig }],
          { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
        );

        onSave(result.uri);
      })
      .catch((error) => {
        console.error("Crop failed:", error);
      });
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 bg-black">
        {/* 이미지 및 크롭 가이드 영역 */}
        <View className="flex-1 justify-center items-center">
          <View
            style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
            className="relative"
          >
            <Image
              source={{ uri }}
              style={StyleSheet.absoluteFill}
              contentFit="contain"
            />

            {/* 어두운 배경 */}
            <View style={StyleSheet.absoluteFill} className="bg-black/60" />

            {/* 크롭 박스 */}
            <GestureDetector gesture={moveGesture}>
              <Animated.View style={[styles.cropBox, boxStyle]}>
                {/* 격자 무늬 (3x3) */}
                <View className="absolute inset-0 border border-white/50 flex-row">
                  <View className="flex-1 border-r border-white/20" />
                  <View className="flex-1 border-r border-white/20" />
                  <View className="flex-1" />
                </View>
                <View className="absolute inset-0 flex-col">
                  <View className="flex-1 border-b border-white/20" />
                  <View className="flex-1 border-b border-white/20" />
                  <View className="flex-1" />
                </View>

                {/* 크기 조절 핸들 (우측 하단) */}
                <GestureDetector gesture={resizeGesture}>
                  <View style={styles.handle} />
                </GestureDetector>
              </Animated.View>
            </GestureDetector>
          </View>
        </View>

        {/* 하단 비율 선택바 */}
        <View className="bg-[#1E1E1E] py-6">
          <View className="flex-row justify-around mb-6 px-4">
            {["자유", "1:1", "3:2", "4:3", "16:9"].map((ratio) => (
              <TouchableOpacity
                key={ratio}
                onPress={() => setAspectRatio(ratio)}
                className={`px-3 py-1 rounded-md ${aspectRatio === ratio ? "bg-yellow-400" : "bg-zinc-700"}`}
              >
                <Text
                  className={
                    aspectRatio === ratio ? "text-black" : "text-white"
                  }
                >
                  {ratio}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 완료 버튼 */}
          <TouchableOpacity
            onPress={handleCrop}
            className="bg-yellow-400 mx-6 py-4 rounded-xl"
          >
            <Text className="text-center font-bold text-lg">완료</Text>
          </TouchableOpacity>
        </View>
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
