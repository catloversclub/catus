"use client"

import React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CatData, useOnboarding } from "@/components/onboarding/onboarding-context"
import { formatGender, formatDate } from "../../_libs/utils"
import { useAddCurrentCat } from "../../_hooks/use-add-current-cat"
import catAvatar from "@/public/cat-avatar.svg"

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
    cat.birthDate && formatDate({ dateStr: cat.birthDate, format: "iso" }),
    cat.breed,
  ].filter(Boolean)

  const genderIcon =
    cat.gender === "male" ? "/icons/male.svg" : cat.gender === "female" ? "/icons/female.svg" : null

  return (
    <div
      key={`cat-${index}-${cat.name}-${cat.birthDate || ""}-${cat.breed || ""}`}
      className="bg-background-secondary border-border-primary flex flex-col items-end justify-center rounded-md border px-3 pt-1.5 pb-6"
    >
      <button
        type="button"
        onClick={handleEdit}
        className="inline-flex cursor-pointer items-center justify-center gap-2 p-3"
      >
        <Image src="/icons/pencil.svg" alt="수정" width={20} height={20} className="h-5 w-5" />
      </button>
      <div className="flex flex-col items-center justify-start gap-3 self-stretch">
        <div className="relative h-20 w-20">
          <Image
            src={cat.imageUrl || catAvatar}
            alt={cat.name}
            width={80}
            height={80}
            className="border-border-primary absolute top-0 left-0 h-20 w-20 rounded-full border object-cover"
            unoptimized
          />
        </div>
        <div className="flex flex-col items-center justify-center gap-1.5 self-stretch">
          <p className="text-text-primary justify-center self-stretch text-center text-sm leading-6 font-semibold">
            {cat.name}
          </p>
          {(infoItems.length > 0 || genderIcon) && (
            <div className="inline-flex items-center justify-center gap-1 self-stretch">
              {infoItems.map((item, idx) => (
                <React.Fragment key={idx}>
                  <span className="text-text-tertiary justify-center text-sm leading-6 font-normal">
                    {item}
                  </span>
                  {(idx < infoItems.length - 1 || genderIcon) && (
                    <div className="h-0.5 w-0.5 rounded-full bg-neutral-400" />
                  )}
                </React.Fragment>
              ))}
              {genderIcon && (
                <Image src={genderIcon} alt={cat.gender === "male" ? "남자" : "여자"} width={16} height={16} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
