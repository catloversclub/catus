import { useEffect, useState } from "react"
import { toast } from "sonner"
import { fetcherWithAuth } from "@/lib/utils"
import { TagOption } from "@/app/onboarding/_libs/schemas"

export function useTagOptions() {
  const [personalityOptions, setPersonalityOptions] = useState<TagOption[]>([])
  const [appearanceOptions, setAppearanceOptions] = useState<TagOption[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadOptions = async () => {
      try {
        setIsLoading(true)
        const [personalityRes, appearanceRes] = await Promise.all([
          fetcherWithAuth.get("attribute/personality").json<TagOption[]>(),
          fetcherWithAuth.get("attribute/appearance").json<TagOption[]>(),
        ])

        setPersonalityOptions(personalityRes)
        setAppearanceOptions(appearanceRes)
      } catch (error) {
        toast.error("태그 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.")
      } finally {
        setIsLoading(false)
      }
    }

    loadOptions()
  }, [])

  return {
    personalityOptions,
    appearanceOptions,
    isLoading,
  }
}

