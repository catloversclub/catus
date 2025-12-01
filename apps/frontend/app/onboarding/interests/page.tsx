"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Chip } from "@/components/ui/chip"
import { useOnboarding } from "@/components/onboarding/onboarding-context"
import { fetcherWithAuth } from "@/lib/utils"

type TagOption = {
  id: number
  label: string
}

export default function OnboardingInterestsPage() {
  const router = useRouter()
  const { draft, setInterests } = useOnboarding()
  const { data: session } = useSession()

  const [personalityOptions, setPersonalityOptions] = useState<TagOption[]>([])
  const [appearanceOptions, setAppearanceOptions] = useState<TagOption[]>([])
  const [selectedPersonality, setSelectedPersonality] = useState<number[]>([])
  const [selectedAppearance, setSelectedAppearance] = useState<number[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    if (!draft.interests || personalityOptions.length === 0 || appearanceOptions.length === 0) {
      return
    }

    const personalityIds = draft.interests
      .filter((value) => value.startsWith("personality:"))
      .map((value) => Number(value.split(":")[1]))
    const appearanceIds = draft.interests
      .filter((value) => value.startsWith("appearance:"))
      .map((value) => Number(value.split(":")[1]))

    setSelectedPersonality(
      personalityIds.filter((id) => personalityOptions.some((option) => option.id === id))
    )
    setSelectedAppearance(
      appearanceIds.filter((id) => appearanceOptions.some((option) => option.id === id))
    )
  }, [draft.interests, personalityOptions, appearanceOptions])

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
      const payload = {
        nickname: draft.nickname,
        hasAgreedToTerms: true,
        isLivingWithCat: draft.hasCat,
        favoritePersonalities: selectedPersonality,
        favoriteAppearances: selectedAppearance,
        phone: null,
        profileImageUrl: draft.catProfile?.imageUrl ?? null,
      }

      const response = await fetcherWithAuth.post("user", {
        json: payload,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || response.statusText)
      }

      const combined = [
        ...selectedPersonality.map((id) => `personality:${id}`),
        ...selectedAppearance.map((id) => `appearance:${id}`),
      ]
      setInterests(combined)
      router.push("/onboarding/complete")
    } catch (error) {
      console.error(error)
      toast.error("관심 태그 저장에 실패했어요. 잠시 후 다시 시도해 주세요.")
    } finally {
      setIsSubmitting(false)
    }
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
