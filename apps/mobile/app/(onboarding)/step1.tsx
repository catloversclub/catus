import { useState } from "react"
import { TextInput, View, Text } from "react-native"
import { useRouter } from "expo-router"
import OnboardingWrapper from "@/app/(onboarding)/components/OnboardingWrapper"
import { useOnboardingStore } from "@/app/(onboarding)/store/useOnboardingStore"

export default function Step1() {
  const router = useRouter()
  const { nickname, setNickname } = useOnboardingStore()
  const [error, setError] = useState("")

  const handleNext = () => {
    // 중복 검사 등 로직 수행...
    router.push("/(onboarding)/step2")
  }

  const isValid = nickname.length > 0 && nickname.length <= 16

  return (
    <OnboardingWrapper
      step={1}
      title="닉네임을 입력해주세요"
      onNext={handleNext}
      isNextEnabled={isValid}
      nextButtonText={isValid ? "다음으로" : "확인"} // 시안 반영
    >
      <View>
        <TextInput
          value={nickname}
          onChangeText={setNickname}
          placeholder="캣러버스클럽"
          maxLength={16}
          className="text-body1 rounded-xl bg-semantic-bg-secondary p-4"
          autoFocus
        />
        <View className="mt-2 flex-row justify-between">
          <Text className="text-label1 text-semantic-text-secondary">중복 여부를 확인해주세요</Text>
          <Text className="text-label1 text-semantic-text-secondary">{nickname.length}/16</Text>
        </View>
      </View>
    </OnboardingWrapper>
  )
}
