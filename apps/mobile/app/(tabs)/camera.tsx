import { View, StyleSheet, Text } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";

export default function CameraScreen() {
  const { imageUri } = useLocalSearchParams<{ imageUri?: string }>();

  if (!imageUri) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          탭바의 카메라 버튼을 눌러 사진을 선택하세요
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: imageUri }}
        style={styles.image}
        contentFit="contain"
      />
      {/* TODO: 여기에 게시글 작성 UI 추가 */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  text: {
    color: "#666",
    fontSize: 16,
  },
});
