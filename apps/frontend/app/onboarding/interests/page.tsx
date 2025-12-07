"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Chip } from "@/components/ui/chip"
import { useOnboarding } from "@/components/onboarding/onboarding-context"
import { useTagOptions } from "@/hooks/use-tag-options"
import { useTagSelection } from "@/hooks/use-tag-selection"
import { useCompleteOnboarding } from "@/hooks/use-complete-onboarding"
import { renderTagRows } from "@/lib/utils/tag-rows"

export default function OnboardingInterestsPage() {
  const router = useRouter()
  const { draft, setInterests } = useOnboarding()
  const { personalityOptions, appearanceOptions } = useTagOptions()
  const {
    selectedPersonality,
    selectedAppearance,
    toggleTag,
    hasSelection,
  } = useTagSelection({
    savedInterests: draft.interests,
    personalityOptions,
    appearanceOptions,
  })
  const { submit, isSubmitting } = useCompleteOnboarding()

  const handleSkip = () => {
    setInterests([])
    router.push("/")
  }

  const handleSave = async () => {
    if (!hasSelection) return
    await submit({
      favoritePersonalities: selectedPersonality,
      favoriteAppearances: selectedAppearance,
    })
  }

  const personalityRows = renderTagRows(personalityOptions, 3)
  const appearanceRows = [
    appearanceOptions.slice(0, 3),
    ...renderTagRows(appearanceOptions.slice(3), 4),
  ]

  return (
    <div className="flex flex-1 flex-col gap-8">
      <p className="text-text-primary mb-3 text-lg leading-7 font-bold">
        마음이 가는 키워드를 골라주시면
        <br />
        맞춤 콘텐츠를 추천해 드릴게요!
      </p>

      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-text-primary text-base font-semibold">성격</p>
            <p className="text-text-tertiary text-xs">최대 2개까지 선택 가능해요</p>
          </div>
          <div className="flex flex-col gap-3">
            {personalityRows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex flex-wrap gap-2">
                {row.map(({ id, label }) => (
                  <Chip
                    key={id}
                    variant={selectedPersonality.includes(id) ? "selected" : "default"}
                    onClick={() => toggleTag("personality", id)}
                    size="sm"
                  >
                    {label}
                  </Chip>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <p className="text-text-primary text-base font-semibold">외모 태그</p>
            <p className="text-text-tertiary text-xs">최대 2개까지 선택 가능해요</p>
          </div>
          <div className="flex flex-col gap-3">
            {appearanceRows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex flex-wrap gap-2">
                {row.map(({ id, label }) => (
                  <Chip
                    key={id}
                    variant={selectedAppearance.includes(id) ? "selected" : "default"}
                    onClick={() => toggleTag("appearance", id)}
                    size="sm"
                  >
                    {label}
                  </Chip>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-2">
          <Button className="w-full" disabled={!hasSelection || isSubmitting} onClick={handleSave}>
            {isSubmitting ? "저장 중..." : "다음으로"}
          </Button>
          <Button variant="ghost" className="w-full" onClick={handleSkip}>
            건너뛰기
          </Button>
        </div>
      </div>
    </div>
  )
}
