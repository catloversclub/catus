"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useOnboarding } from "@/components/onboarding/onboarding-context"

export default function CatProfileCompletePage() {
  const router = useRouter()
  const { draft, addCat, resetCurrentCat } = useOnboarding()
  const hasAddedRef = useRef(false)

  useEffect(() => {
    if (hasAddedRef.current) return

    if (draft.catProfile?.name) {
      const isAlreadyAdded = draft.cats?.some(
        (cat) =>
          cat.name === draft.catProfile?.name &&
          cat.birthDate === draft.catProfile?.birthDate &&
          cat.breed === draft.catProfile?.breed
      )

      if (!isAlreadyAdded) {
        addCat({
          name: draft.catProfile.name,
          gender: draft.catProfile.gender,
          birthDate: draft.catProfile.birthDate,
          breed: draft.catProfile.breed,
          imageUrl: draft.catProfile.imageUrl,
          personalities: draft.catTags
            ?.filter((tag) => tag.startsWith("personality:"))
            .map((tag) => Number(tag.split(":")[1])) || [],
          appearances: draft.catTags
            ?.filter((tag) => tag.startsWith("appearance:"))
            .map((tag) => Number(tag.split(":")[1])) || [],
        })
        hasAddedRef.current = true
      }
    }
  }, [])

  const allCats = draft.cats || []

  const formatGender = (gender?: string) => {
    switch (gender) {
      case "male":
        return "남자"
      case "female":
        return "여자"
      default:
        return "선택 안 함"
    }
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null
    const [year, month, day] = dateStr.split("-")
    return `${year}년 ${parseInt(month)}월 ${parseInt(day)}일`
  }

  const handleAddAnother = () => {
    resetCurrentCat()
    router.push("/onboarding/cat-profile")
  }

  const handleNext = () => {
    resetCurrentCat()
    router.push("/onboarding/interests")
  }

  return (
    <div className="flex flex-1 flex-col gap-8">
      <div className="flex flex-1 flex-col gap-6">
        <p className="text-text-primary text-lg leading-7 font-bold">
          고양이 정보 입력이 완료되었어요!
        </p>

        {allCats.length > 0 && (
          <div className="flex flex-col gap-4">
            {allCats.map((cat, index) => (
              <div
                key={`cat-${index}-${cat.name}-${cat.birthDate || ""}-${cat.breed || ""}`}
                className="bg-background-secondary rounded-lg p-4"
              >
                <div className="flex items-start gap-4">
                  {cat.imageUrl && (
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <p className="text-text-primary text-base font-semibold">{cat.name}</p>
                      {cat.gender && (
                        <span className="text-text-tertiary text-xs">
                          ({formatGender(cat.gender)})
                        </span>
                      )}
                    </div>
                    {cat.birthDate && (
                      <p className="text-text-secondary text-sm">{formatDate(cat.birthDate)}</p>
                    )}
                    {cat.breed && (
                      <p className="text-text-secondary text-sm">품종: {cat.breed}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-auto flex flex-col gap-2">
        <Button className="w-full" onClick={handleAddAnother}>
          고양이 더 추가하기
        </Button>
        <Button variant="ghost" className="w-full" onClick={handleNext}>
          다음으로
        </Button>
      </div>
    </div>
  )
}

