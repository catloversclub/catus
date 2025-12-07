import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { completeOnboarding } from "@/lib/onboarding/complete-onboarding"
import { useOnboarding } from "@/components/onboarding/onboarding-context"

export function useCompleteOnboarding() {
  const router = useRouter()
  const { draft, setInterests } = useOnboarding()
  const { data: session } = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async (params: {
    favoritePersonalities: number[]
    favoriteAppearances: number[]
  }) => {
    if (!draft.nickname) {
      toast.error("닉네임 정보를 찾을 수 없어요. 처음 단계부터 다시 진행해주세요.")
      return
    }

    if (!session?.idToken) {
      toast.error("세션 정보가 만료되었어요. 다시 로그인 해주세요.")
      return
    }

    setIsSubmitting(true)
    try {
      const result = await completeOnboarding({
        nickname: draft.nickname,
        hasCat: draft.hasCat ?? false,
        favoritePersonalities: params.favoritePersonalities,
        favoriteAppearances: params.favoriteAppearances,
        cats: draft.cats || [],
      })

      if (result.failedCatCount && result.failedCatCount > 0) {
        toast.error("일부 고양이 정보 저장에 실패했어요. 나중에 마이페이지에서 추가해 주세요.")
      }

      const combined = [
        ...params.favoritePersonalities.map((id) => `personality:${id}`),
        ...params.favoriteAppearances.map((id) => `appearance:${id}`),
      ]
      setInterests(combined)
      router.push("/onboarding/complete")
    } catch (error) {
      toast.error("저장에 실패했어요. 잠시 후 다시 시도해 주세요.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    submit,
    isSubmitting,
  }
}

