import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function HomeScreen() {
  const router = useRouter();

  // 테스트용 로그아웃 함수
  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    router.replace("/"); // 다시 첫 로그인 화면으로 쫓아냄
  };

  return (
    <View className="flex-1 items-center justify-center gap-6 bg-white">
      <Text className="text-2xl font-bold text-gray-800">메인 홈 화면 🏠</Text>
      <Text className="text-base text-gray-500">로그인에 성공하셨습니다!</Text>

      <TouchableOpacity
        onPress={handleLogout}
        className="rounded-xl bg-red-100 px-8 py-4"
      >
        <Text className="font-bold text-red-600">로그아웃</Text>
      </TouchableOpacity>
    </View>
  );
}
