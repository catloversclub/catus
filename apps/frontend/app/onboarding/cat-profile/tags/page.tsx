"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Chip } from "@/components/ui/chip"
import { useOnboarding } from "@/components/onboarding/onboarding-context"
import { fetcherWithAuth } from "@/lib/utils"
import { TagOption } from "../../_libs/schemas"

export default function CatTagsPage() {
  const router = useRouter()
  const { draft, setCatTags } = useOnboarding()

  const [personalityOptions, setPersonalityOptions] = useState<TagOption[]>([])
  const [appearanceOptions, setAppearanceOptions] = useState<TagOption[]>([])
  const [selectedPersonality, setSelectedPersonality] = useState<number[]>([])
  const [selectedAppearance, setSelectedAppearance] = useState<number[]>([])

  const renderRows = (items: ReadonlyArray<TagOption>, chunkSize: number) => {
    return items.reduce<TagOption[][]>((rows, item, index) => {
      const rowIndex = Math.floor(index / chunkSize)
      if (!rows[rowIndex]) rows[rowIndex] = []
      rows[rowIndex]!.push(item)
      return rows
    }, [])
  }

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [personalityRes, appearanceRes] = await Promise.all([
          fetcherWithAuth.get("attribute/personality").json<TagOption[]>(),
          fetcherWithAuth.get("attribute/appearance").json<TagOption[]>(),
        ])

        setPersonalityOptions(personalityRes)
        setAppearanceOptions(appearanceRes)
      } catch (error) {
        console.error("[onboarding] failed to load tag options", error)
        toast.error("태그 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.")
      }
    }

    loadOptions()
  }, [])

  useEffect(() => {
    if (!draft.catTags || personalityOptions.length === 0 || appearanceOptions.length === 0) {
      return
    }

    const personalityIds = draft.catTags
      .filter((value) => value.startsWith("personality:"))
      .map((value) => Number(value.split(":")[1]))
    const appearanceIds = draft.catTags
      .filter((value) => value.startsWith("appearance:"))
      .map((value) => Number(value.split(":")[1]))

    setSelectedPersonality(
      personalityIds.filter((id) => personalityOptions.some((option) => option.id === id))
    )
    setSelectedAppearance(
      appearanceIds.filter((id) => appearanceOptions.some((option) => option.id === id))
    )
  }, [draft.catTags, personalityOptions, appearanceOptions])

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

  const handleNext = () => {
    const combined = [
      ...selectedPersonality.map((id) => `personality:${id}`),
      ...selectedAppearance.map((id) => `appearance:${id}`),
    ]
    setCatTags(combined)
    router.push("/onboarding/cat-profile/complete")
  }

  const hasSelection = selectedPersonality.length + selectedAppearance.length > 0

  const personalityRows = renderRows(personalityOptions, 3)
  const appearanceRows = [
    appearanceOptions.slice(0, 3),
    ...renderRows(appearanceOptions.slice(3), 4),
  ]

  return (
    <div className="flex flex-1 flex-col gap-8">
      <p className="text-text-primary mb-3 text-lg leading-7 font-bold">
        고양이의 성격과 외모를
        <br />
        태그로 선택해 주세요!
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
          <Button className="w-full" disabled={!hasSelection} onClick={handleNext}>
            다음으로
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => {
              setCatTags([])
              router.push("/onboarding/cat-profile/complete")
            }}
          >
            건너뛰기
          </Button>
        </div>
      </div>
    </div>
  )
}

