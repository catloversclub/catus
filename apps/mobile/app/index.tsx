import { useLogin } from "@/api/domains/auth/queries"
import { Text, TouchableOpacity, useColorScheme, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import KakaoLogo from "@/assets/icons/kakao.svg"
import GoogleLogo from "@/assets/icons/google.svg"
import AppleLogo from "@/assets/icons/apple.svg"
import { Image } from "expo-image"
import { cn } from "@/lib/utils"

type Provider = "kakao" | "google" | "apple"

interface LoginOption {
  id: Provider
  label: string
  containerClass: string
  textClass?: string
  Icon: React.ElementType
}

const LOGIN_OPTIONS: LoginOption[] = [
  {
    id: "kakao",
    label: "카카오 로그인",
    containerClass: "bg-[#FEE500]",
    Icon: KakaoLogo,
  },
  {
    id: "google",
    label: "Google 로그인",
    containerClass: "bg-[#F2F2F2]",
    Icon: GoogleLogo,
  },
  {
    id: "apple",
    label: "Apple 로그인",
    containerClass: "bg-black dark:bg-gray-0",
    textClass: "text-white dark:text-black",
    Icon: AppleLogo,
  },
]

export default function Index() {
  const { mutate: login } = useLogin()
  const colorScheme = useColorScheme()

  return (
    <SafeAreaView className="flex-1 items-center bg-semantic-bg-primary px-4">
      <View className="flex-1 items-center justify-center">
        <Logo />
      </View>
      <View className="w-full flex-col gap-2 pb-16">
        {LOGIN_OPTIONS.map(({ id, label, containerClass, textClass, Icon }) => (
          <TouchableOpacity
            key={id}
            onPress={() => login(id)}
            className={cn(
              "w-full flex-row items-center justify-center gap-3 rounded-md py-4",
              containerClass,
            )}
          >
            <Icon
              className="size-10"
              color={id === "apple" ? (colorScheme === "dark" ? "#000000" : "#ffffff") : undefined}
            />
            <Text className={cn("typo-body1", textClass)}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  )
}

function Logo() {
  let colorScheme = useColorScheme()
  return (
    <Image
      style={{ width: 180, height: 180 }}
      source={
        colorScheme === "dark"
          ? require("@/assets/images/logo/col-dark.png")
          : require("@/assets/images/logo/col-light.png")
      }
      contentFit="cover"
    />
  )
}
