import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center gap-6 bg-white">
      <Text className="text-2xl font-bold text-gray-800">환영합니다! 🎉</Text>
      <Text className="text-base text-gray-500">
        초기 프로필 설정을 진행해 주세요.
      </Text>

      {/* 테스트용: 온보딩 끝내고 홈으로 넘어가는 버튼 */}
      <TouchableOpacity
        onPress={() => router.replace("/(tabs)")}
        className="rounded-xl bg-blue-500 px-8 py-4"
      >
        <Text className="font-bold text-white">설정 완료하고 홈으로 가기</Text>
      </TouchableOpacity>
    </View>
  );
}
