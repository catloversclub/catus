"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CatData, useOnboarding } from "@/components/onboarding/onboarding-context"
import { formatGender, formatDate } from "../../_libs/utils"
import { useAddCurrentCat } from "../../_hooks/use-add-current-cat"

export default function CatProfileCompletePage() {
  const router = useRouter()
  const { draft, resetCurrentCat } = useOnboarding()
  useAddCurrentCat()

  const allCats = draft.cats || []

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
        <CatList cats={allCats} />
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

interface CatListProps {
  cats: CatData[]
}

function CatList({ cats }: CatListProps) {
  if (cats.length === 0) return null

  return (
    <div className="flex flex-col gap-4">
      {cats.map((cat, index) => (
        <CatCard key={index} cat={cat} index={index} />
      ))}
    </div>
  )
}

interface CatCardProps {
  cat: CatData
  index: number
}

function CatCard({ cat, index }: CatCardProps) {
  return (
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
  )
}