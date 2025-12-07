"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CatData, useOnboarding } from "@/components/onboarding/onboarding-context"
import { formatGender, formatDate } from "../../_libs/utils"
import { useAddCurrentCat } from "../../_hooks/use-add-current-cat"
import { FaPencil } from "react-icons/fa6"

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
        <CatCard
          key={`${cat.name}-${cat.birthDate || ""}-${cat.breed || ""}-${index}`}
          cat={cat}
          index={index}
        />
      ))}
    </div>
  )
}

interface CatCardProps {
  cat: CatData
  index: number
}

function CatCard({ cat, index }: CatCardProps) {
  const router = useRouter()
  const { setCatProfile, setCatTags, setEditingCatIndex } = useOnboarding()

  const handleEdit = () => {
    setEditingCatIndex(index)
    setCatProfile({
      name: cat.name,
      gender: cat.gender,
      birthDate: cat.birthDate,
      breed: cat.breed,
      imageUrl: cat.imageUrl,
    })
    const tags: string[] = []
    if (cat.personalities) {
      tags.push(...cat.personalities.map((id) => `personality:${id}`))
    }
    if (cat.appearances) {
      tags.push(...cat.appearances.map((id) => `appearance:${id}`))
    }
    setCatTags(tags)
    router.push("/onboarding/cat-profile")
  }

  const infoItems = [
    cat.birthDate && formatDate(cat.birthDate),
    cat.breed,
    cat.gender && formatGender(cat.gender),
  ].filter(Boolean)

  return (
    <div
      key={`cat-${index}-${cat.name}-${cat.birthDate || ""}-${cat.breed || ""}`}
      className="bg-background-secondary rounded-md px-3 pt-1.5 pb-6 border border-border-primary flex flex-col justify-center items-end"
    >
      <button
        type="button"
        onClick={handleEdit}
        className="p-3 rounded-[100px] inline-flex justify-center items-center gap-2"
      >
        <FaPencil className="w-5 h-5" />
      </button>
      <div className="self-stretch flex flex-col justify-start items-center gap-3">
        <div className="w-20 h-20 relative">
          {cat.imageUrl ? (
            <img
              src={cat.imageUrl}
              alt={cat.name}
              className="w-20 h-20 absolute left-0 top-0 rounded-full border border-border-primary object-cover"
            />
          ) : (
            <div className="w-20 h-20 absolute left-0 top-0 rounded-full border border-border-primary bg-background-secondary" />
          )}
        </div>
        <div className="self-stretch flex flex-col justify-center items-center gap-1.5">
          <p className="self-stretch text-center justify-center text-text-primary text-sm font-semibold leading-6">
            {cat.name}
          </p>
          {infoItems.length > 0 && (
            <div className="self-stretch inline-flex justify-center items-center gap-1">
              {infoItems.map((item, idx) => (
                <React.Fragment key={idx}>
                  <span className="justify-center text-text-tertiary text-sm font-normal leading-6">
                    {item}
                  </span>
                  {idx < infoItems.length - 1 && (
                    <div className="w-0.5 h-0.5 bg-neutral-400 rounded-full" />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}