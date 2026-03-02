import { useEffect } from "react"; // 👈 추가
import { useAuth } from "@/hooks/useAuth";
import { View, Text, TouchableOpacity } from "react-native";

export default function Index() {
  const { signIn, checkInitialAuth } = useAuth();

  // 🌟 앱이 켜지고 로그인 화면이 렌더링될 때 토큰 유무 검사
  useEffect(() => {
    checkInitialAuth();
  }, []);

  return (
    <View className="flex-1 items-center justify-center gap-4 bg-white">
      <Text className="mb-8 text-xl font-bold text-gray-800">환영합니다!</Text>

      <TouchableOpacity
        onPress={() => signIn("kakao")}
        className="w-4/5 items-center rounded-xl bg-[#FEE500] py-4"
      >
        <Text className="text-base font-bold text-black/85">카카오 로그인</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => signIn("google")}
        className="w-4/5 items-center rounded-xl bg-gray-100 py-4"
      >
        <Text className="text-base font-bold text-gray-800">구글 로그인</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => signIn("apple")}
        className="w-4/5 items-center rounded-xl bg-black py-4"
      >
        <Text className="text-base font-bold text-white">Apple로 로그인</Text>
      </TouchableOpacity>
    </View>
  );
}
