import React, { useRef, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import ViewShot from "react-native-view-shot";

interface MosaicData {
  id: number;
  type: "rect" | "circle";
  x: number;
  y: number;
  width: number;
  height: number;
}

interface MosaicToolProps {
  uri: string;
  onSave: (editedUri: string) => void;
  onCancel: () => void;
}

export default function MosaicTool({ uri, onSave, onCancel }: MosaicToolProps) {
  const [mosaics, setMosaics] = useState<MosaicData[]>([]); // 생성된 모자이크 리스트
  const [selectedType, setSelectedType] = useState<"rect" | "circle">("rect");
  const viewShotRef = useRef<ViewShot>(null); // 캡처를 위한 Ref

  // [핵심] 완료 버튼 클릭 시 실행될 함수
  const handleComplete = async () => {
    if (viewShotRef.current?.capture) {
      try {
        // 1. 현재 화면에 보이는 캔버스(이미지+모자이크)를 캡처하여 새로운 이미지 생성
        const editedUri = await viewShotRef.current.capture();

        // 2. 부모 컴포넌트(EditorScreen)의 handleEditSave 호출
        onSave(editedUri);
      } catch (error) {
        console.error("저장 중 오류 발생:", error);
      }
    }
  };
  // 새로운 모자이크 추가 함수
  const addMosaic = () => {
    const newMosaic: MosaicData = {
      id: Date.now(),
      type: selectedType,
      x: 100,
      y: 100,
      width: 100,
      height: 100,
    };
    setMosaics([...mosaics, newMosaic]);
  };

  // 마지막 모자이크 제거 (되돌리기)
  const undoMosaic = () => {
    setMosaics((prev) => prev.slice(0, -1));
  };

  return (
    <View className="flex-1 bg-black">
      {/* 1. 메인 이미지 및 모자이크 오버레이 영역 */}
      <View className="flex-1 justify-center items-center">
        <ViewShot
          ref={viewShotRef}
          options={{ format: "jpg", quality: 0.9 }}
          style={{ width: "100%", aspectRatio: 1 }}
        >
          <View className="relative w-full aspect-square bg-zinc-900">
            <Image
              source={{ uri }}
              style={StyleSheet.absoluteFill}
              contentFit="contain"
            />

            {/* 생성된 모자이크들 렌더링 */}
            {mosaics.map((item) => (
              <MosaicItem key={item.id} item={item} />
            ))}
          </View>
        </ViewShot>
      </View>

      {/* 2. 하단 전용 툴바 (기획안 반영) */}
      <View className="bg-[#1E1E1E] p-6 pb-10">
        <View className="flex-row justify-center items-center space-x-4 mb-8 bg-[#2A2A2A] rounded-full py-3 px-6 self-center">
          {/* 되돌리기/다시실행 (기획안 왼쪽 아이콘들) */}
          <TouchableOpacity
            className="mr-4"
            onPress={undoMosaic}
            disabled={mosaics.length === 0}
          >
            <Text
              className={`text-xl ${mosaics.length === 0 ? "text-zinc-600" : "text-white"}`}
            >
              ↩️
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="mr-6">
            <Text className="text-zinc-600 text-xl">↪️</Text>
          </TouchableOpacity>

          <View className="w-[1px] h-6 bg-zinc-600 mr-6" />

          {/* 사각형/원형 선택 (기획안 오른쪽 아이콘들) */}
          <TouchableOpacity
            onPress={() => setSelectedType("rect")}
            className={`p-2 rounded ${selectedType === "rect" ? "bg-zinc-600" : ""}`}
          >
            <View className="w-6 h-6 border border-white opacity-60" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedType("circle")}
            className={`p-2 rounded ${selectedType === "circle" ? "bg-zinc-600" : ""}`}
          >
            <View className="w-6 h-6 border border-white rounded-full opacity-60" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={addMosaic}
            className="ml-4 bg-yellow-400 rounded-full px-3 py-1"
          >
            <Text className="font-bold text-xs">+ 추가</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleComplete} // 여기서 저장 로직 호출
          className="bg-yellow-400 py-4 rounded-xl"
        >
          <Text className="text-center font-bold text-lg">완료</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

interface MosaicItemProps {
  item: MosaicData;
}

// 개별 모자이크 아이템 (드래그 및 리사이즈 지원)
function MosaicItem({ item }: MosaicItemProps) {
  const x = useSharedValue(item.x);
  const y = useSharedValue(item.y);
  const width = useSharedValue(item.width);
  const height = useSharedValue(item.height);

  const moveGesture = Gesture.Pan().onChange((e) => {
    x.value += e.changeX;
    y.value += e.changeY;
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }],
    width: width.value,
    height: height.value,
    borderRadius: item.type === "circle" ? width.value / 2 : 0,
  }));

  return (
    <GestureDetector gesture={moveGesture}>
      <Animated.View style={[animatedStyle, styles.mosaicBox]}>
        {/* 실제 모자이크 느낌을 주는 Blur 효과 */}
        <BlurView intensity={80} style={StyleSheet.absoluteFill} tint="dark" />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  mosaicBox: {
    position: "absolute",
    borderWidth: 1,
    borderColor: "#FFD700",
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.1)",
  },
});
