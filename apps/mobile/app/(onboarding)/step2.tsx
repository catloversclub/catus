import { View, TouchableOpacity, Text } from "react-native"
import { useRouter } from "expo-router"
import { cn } from "@/lib/utils"
import { useOnboardingStore } from "@/app/(onboarding)/store/useOnboardingStore"
import OnboardingWrapper from "@/app/(onboarding)/components/OnboardingWrapper"

export default function Step2() {
  const router = useRouter()
  const { isCatOwner, setIsCatOwner } = useOnboardingStore()

  const handleNext = () => {
    router.push("/(onboarding)/step3")
  }

  return (
    <OnboardingWrapper
      step={2}
      title="지금 고양이와 살고 있나요?"
      onNext={handleNext}
      isNextEnabled={isCatOwner !== null}
    >
      <View className="flex-row gap-3">
        {/* '네' 버튼 */}
        <TouchableOpacity
          onPress={() => setIsCatOwner(true)}
          className={cn(
            "flex-1 items-center rounded-xl py-4",
            isCatOwner === true
              ? "bg-semantic-button-primary-background"
              : "bg-semantic-bg-secondary",
          )}
        >
          <Text className="text-body1 font-bold">네</Text>
        </TouchableOpacity>

        {/* '아니오' 버튼 */}
        <TouchableOpacity
          onPress={() => setIsCatOwner(false)}
          className={cn(
            "flex-1 items-center rounded-xl py-4",
            isCatOwner === false
              ? "bg-semantic-button-primary-background"
              : "bg-semantic-bg-secondary",
          )}
        >
          <Text className="text-body1 font-bold">아니오</Text>
        </TouchableOpacity>
      </View>
    </OnboardingWrapper>
  )
}
