import React from "react";
import { Text } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

interface TextItemProps {
  uri: string;
  onSave: (editedUri: string) => void;
  onCancel: () => void;
}

export default function TextItem({ content, color, canvasSize }: any) {
  // Hook은 여기(컴포넌트 내부)에서 호출해야 에러가 나지 않습니다.
  const x = useSharedValue(canvasSize / 2 - 50);
  const y = useSharedValue(canvasSize / 2 - 20);

  const moveGesture = Gesture.Pan().onChange((e) => {
    x.value += e.changeX;
    y.value += e.changeY;
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }],
    position: "absolute",
  }));

  return (
    <GestureDetector gesture={moveGesture}>
      <Animated.View style={animatedStyle}>
        <Text style={{ color, fontSize: 24, fontWeight: "bold" }}>
          {content}
        </Text>
      </Animated.View>
    </GestureDetector>
  );
}
