import React, { useState } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
import { Image } from "expo-image";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface CropToolProps {
  uri: string;
  onSave: (croppedUri: string) => void;
  onCancel: () => void;
}

export default function CropTool({ uri, onSave, onCancel }: CropToolProps) {
  // 1. 현재 선택된 비율 상태 (기획서 하단 버튼용)
  const [aspectRatio, setAspectRatio] = useState("자유");

  // 2. 실제 자르기 실행 함수
  const handleCrop = async () => {
    // 실제로는 사용자가 조절한 그리드의 좌표(originX, originY, width, height)를 계산해야 함
    // 여기서는 예시로 중앙 80%를 자르는 로직을 넣었습니다.
    const cropAction = {
      originX: 100,
      originY: 100,
      width: 800,
      height: 800,
    };

    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ crop: cropAction }],
      { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
    );

    onSave(result.uri); // 잘린 이미지 경로를 부모에게 전달
  };

  return (
    <View className="flex-1 bg-black">
      {/* 이미지 및 크롭 가이드 영역 */}
      <View className="flex-1 justify-center items-center">
        <View
          style={{ width: SCREEN_WIDTH - 40, aspectRatio: 1 }}
          className="border-2 border-blue-400 relative"
        >
          <Image
            source={{ uri }}
            className="w-full h-full"
            contentFit="contain"
          />

          {/* 기획서의 하얀색 격자(Grid) UI */}
          <View className="absolute inset-0 border border-white/50 flex-row justify-between">
            <View className="w-[33%] border-r border-white/30 h-full" />
            <View className="w-[33%] border-r border-white/30 h-full" />
          </View>
          <View className="absolute inset-0 flex-column justify-between">
            <View className="h-[33%] border-b border-white/30 w-full" />
            <View className="h-[33%] border-b border-white/30 w-full" />
          </View>
        </View>
      </View>

      {/* 하단 비율 선택바 (기획서 하단) */}
      <View className="bg-[#1E1E1E] py-6">
        <View className="flex-row justify-around mb-6 px-4">
          {["자유", "1:1", "3:2", "4:3", "16:9"].map((ratio) => (
            <TouchableOpacity
              key={ratio}
              onPress={() => setAspectRatio(ratio)}
              className={`px-3 py-1 rounded-md ${aspectRatio === ratio ? "bg-yellow-400" : "bg-zinc-700"}`}
            >
              <Text
                className={aspectRatio === ratio ? "text-black" : "text-white"}
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
  );
}
