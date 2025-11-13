"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Chip } from "@/components/ui/chip"
import { useOnboarding } from "@/components/onboarding/onboarding-context"
import { appearanceTagOptions, personalityTagOptions } from "../_libs/schemas"

export default function OnboardingInterestsPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { draft, setInterests } = useOnboarding()

  const renderRows = (
    items: ReadonlyArray<{ id: number; label: string }>,
    chunkSize: number,
  ) => {
    return items.reduce<{ id: number; label: string }[][]>((rows, item, index) => {
      const rowIndex = Math.floor(index / chunkSize)
      if (!rows[rowIndex]) rows[rowIndex] = []
      rows[rowIndex]!.push(item)
      return rows
    }, [])
  }

  const [selectedPersonality, setSelectedPersonality] = useState<number[]>(
    draft.interests
      ?.map((value) => Number(value))
      .filter((value) => personalityTagOptions.some((option) => option.id === value)) ?? [],
  )
  const [selectedAppearance, setSelectedAppearance] = useState<number[]>(
    draft.interests
      ?.map((value) => Number(value))
      .filter((value) => appearanceTagOptions.some((option) => option.id === value)) ?? [],
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleToggle = (category: "personality" | "appearance", id: number) => {
    const [selected, setter] =
      category === "personality"
        ? [selectedPersonality, setSelectedPersonality]
        : [selectedAppearance, setSelectedAppearance]

    const isSelected = selected.includes(id)
    if (isSelected) {
      setter(selected.filter((value) => value !== id))
      return
    }

    if (selected.length >= 2) {
      toast("최대 2개까지 선택할 수 있어요.")
      return
    }

    setter([...selected, id])
  }

  const handleSkip = () => {
    setInterests([])
    router.push("/")
  }

  const handleSave = async () => {
    const hasSelection = selectedPersonality.length + selectedAppearance.length > 0
    if (!hasSelection) return

    // TODO: API 요청
  }

  const hasSelection = selectedPersonality.length + selectedAppearance.length > 0

  const personalityRows = renderRows(personalityTagOptions, 3)
  const appearanceRows = [
    appearanceTagOptions.slice(0, 3),
    ...renderRows(appearanceTagOptions.slice(3), 4),
  ]

  return (
    <div className="flex flex-1 flex-col gap-8">
      <p className="text-lg font-bold text-text-primary leading-7 mb-3">
        마음이 가는 키워드를 골라주시면
        <br />
        맞춤 콘텐츠를 추천해 드릴게요!
      </p>

      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-base font-semibold text-text-primary">성격</p>
            <p className="text-xs text-text-tertiary">최대 2개까지 선택 가능해요</p>
          </div>
          <div className="flex flex-col gap-3">
            {personalityRows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex flex-wrap gap-2">
                {row.map(({ id, label }) => (
                  <Chip
                    key={id}
                    variant={selectedPersonality.includes(id) ? "selected" : "default"}
                    onClick={() => handleToggle("personality", id)}
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
            <p className="text-base font-semibold text-text-primary">외모 태그</p>
            <p className="text-xs text-text-tertiary">최대 2개까지 선택 가능해요</p>
          </div>
          <div className="flex flex-col gap-3">
            {appearanceRows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex flex-wrap gap-2">
                {row.map(({ id, label }) => (
                  <Chip
                    key={id}
                    variant={selectedAppearance.includes(id) ? "selected" : "default"}
                    onClick={() => handleToggle("appearance", id)}
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
