import React, { useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  TextInput,
} from "react-native";
import { Image } from "expo-image";
import ViewShot from "react-native-view-shot";

import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

function TextItem({
  content,
  color,
  canvasSize,
}: {
  content: string;
  color: string;
  canvasSize: number;
}) {
  // 제스처 상태값
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const savedScale = useSharedValue(1);
  const savedRotation = useSharedValue(0);

  // 1. 이동 제스처
  const dragGesture = Gesture.Pan().onChange((e) => {
    x.value += e.changeX;
    y.value += e.changeY;
  });

  // 2. 확대 및 회전 제스처 (인스타그램 방식)
  const pinchAndRotateGesture = Gesture.Simultaneous(
    Gesture.Pinch()
      .onChange((e) => {
        scale.value = savedScale.value * e.scale;
      })
      .onEnd(() => {
        savedScale.value = scale.value;
      }),
    Gesture.Rotation()
      .onChange((e) => {
        rotation.value = savedRotation.value + e.rotation;
      })
      .onEnd(() => {
        savedRotation.value = rotation.value;
      }),
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { scale: scale.value },
      { rotate: `${rotation.value}rad` },
    ],
    position: "absolute",
    alignSelf: "center",
    top: canvasSize / 2,
  }));

  const combinedGesture = Gesture.Race(dragGesture, pinchAndRotateGesture);

  return (
    <GestureDetector gesture={combinedGesture}>
      <Animated.View style={animatedStyle}>
        <Text
          style={{
            color,
            fontSize: 32,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {content}
        </Text>
      </Animated.View>
    </GestureDetector>
  );
}

interface TextToolProps {
  uri: string;
  onSave: (editedUri: string) => void;
  onCancel: () => void;
}

export default function TextTool({ uri, onSave, onCancel }: TextToolProps) {
  const [texts, setTexts] = useState<
    { id: number; content: string; color: string }[]
  >([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputText, setInputText] = useState("");
  const viewShotRef = useRef<ViewShot>(null);

  const handleAddText = () => {
    if (inputText.trim()) {
      setTexts([
        ...texts,
        { id: Date.now(), content: inputText, color: "#FFFFFF" },
      ]);
      setInputText("");
      setIsModalVisible(false);
    }
  };

  const handleComplete = async () => {
    if (viewShotRef.current?.capture) {
      const editedUri = await viewShotRef.current.capture();
      onSave(editedUri);
    }
  };

  return (
    <View className="flex-1 bg-black">
      {/* 1. 편집 캔버스 영역 */}
      <View className="flex-1 justify-center items-center">
        <ViewShot
          ref={viewShotRef}
          options={{ format: "jpg", quality: 0.9 }}
          style={{ width: "100%", aspectRatio: 1 }}
        >
          <View className="relative w-full h-full bg-zinc-900 justify-center">
            <Image
              source={{ uri }}
              style={StyleSheet.absoluteFill}
              contentFit="contain"
            />
            {texts.map((t) => (
              <TextItem
                key={t.id}
                content={t.content}
                color={t.color}
                canvasSize={400}
              />
            ))}
          </View>
        </ViewShot>
      </View>

      {/* 2. 하단 툴바 (기획서 반영) */}
      <View className="bg-[#1E1E1E] p-6 pb-10">
        <View className="flex-row justify-center items-center space-x-6 mb-8 bg-[#2A2A2A] rounded-full py-3 px-6 self-center">
          <TouchableOpacity
            onPress={() => setTexts((prev) => prev.slice(0, -1))}
          >
            <Text className="text-white text-xl">↩️</Text>
          </TouchableOpacity>
          <View className="w-[1px] h-6 bg-zinc-600 mx-2" />
          <TouchableOpacity
            onPress={() => setIsModalVisible(true)}
            className="bg-yellow-400 px-6 py-1 rounded-full"
          >
            <Text className="font-bold text-black text-sm">T+ 텍스트 추가</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleComplete}
          className="bg-yellow-400 py-4 rounded-xl"
        >
          <Text className="text-center font-bold text-lg">완료</Text>
        </TouchableOpacity>
      </View>

      {/* 텍스트 입력 모달 */}
      <Modal visible={isModalVisible} transparent animationType="fade">
        <View className="flex-1 bg-black/80 justify-center items-center p-6">
          <TextInput
            autoFocus
            style={{
              color: "white",
              fontSize: 30,
              fontWeight: "bold",
              width: "100%",
              textAlign: "center",
            }}
            value={inputText}
            onChangeText={setInputText}
            placeholder="문구를 입력하세요"
            placeholderTextColor="#666"
          />
          <TouchableOpacity
            onPress={handleAddText}
            className="mt-10 bg-yellow-400 px-10 py-3 rounded-full"
          >
            <Text className="font-bold text-lg">확인</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
