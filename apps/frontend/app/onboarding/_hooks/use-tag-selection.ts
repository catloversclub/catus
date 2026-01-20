import { useEffect, useState } from "react"
import { toast } from "sonner"
import { TagOption } from "@/app/onboarding/_libs/schemas"

interface UseTagSelectionParams {
  savedInterests?: string[]
  personalityOptions: TagOption[]
  appearanceOptions: TagOption[]
}

export function useTagSelection({
  savedInterests,
  personalityOptions,
  appearanceOptions,
}: UseTagSelectionParams) {
  const [selectedPersonality, setSelectedPersonality] = useState<number[]>([])
  const [selectedAppearance, setSelectedAppearance] = useState<number[]>([])

  useEffect(() => {
    if (!savedInterests || personalityOptions.length === 0 || appearanceOptions.length === 0) {
      return
    }

    const personalityIds = savedInterests
      .filter((value) => value.startsWith("personality:"))
      .map((value) => Number(value.split(":")[1]))
    const appearanceIds = savedInterests
      .filter((value) => value.startsWith("appearance:"))
      .map((value) => Number(value.split(":")[1]))

    setSelectedPersonality(
      personalityIds.filter((id) => personalityOptions.some((option) => option.id === id))
    )
    setSelectedAppearance(
      appearanceIds.filter((id) => appearanceOptions.some((option) => option.id === id))
    )
  }, [savedInterests, personalityOptions, appearanceOptions])

  const toggleTag = (category: "personality" | "appearance", id: number) => {
    const [selected, setter] =
      category === "personality"
        ? [selectedPersonality, setSelectedPersonality]
        : [selectedAppearance, setSelectedAppearance]

    const isSelected = selected.includes(id)
    if (isSelected) {
      setter(selected.filter((value) => value !== id))
      return
    }

    const totalSelected = selectedPersonality.length + selectedAppearance.length
    if (totalSelected >= 4) {
      toast.error("4개를 모두 선택했어요")
      return
    }

    if (selected.length >= 2) {
      toast.error("최대 2개까지 선택할 수 있어요.")
      return
    }

    setter([...selected, id])
  }

  const hasSelection = selectedPersonality.length + selectedAppearance.length > 0

  const toInterestStrings = () => {
    return [
      ...selectedPersonality.map((id) => `personality:${id}`),
      ...selectedAppearance.map((id) => `appearance:${id}`),
    ]
  }

  return {
    selectedPersonality,
    selectedAppearance,
    toggleTag,
    hasSelection,
    toInterestStrings,
  }
}
