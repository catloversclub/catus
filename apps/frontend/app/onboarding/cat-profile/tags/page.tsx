"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Chip } from "@/components/ui/chip"
import { useOnboarding } from "@/components/onboarding/onboarding-context"
import { useTagOptions } from "@/app/onboarding/_hooks/use-tag-options"
import { useTagSelection } from "@/app/onboarding/_hooks/use-tag-selection"
import { renderTagRows } from "@/app/onboarding/_libs/utils"

export default function CatTagsPage() {
  const router = useRouter()
  const { draft, setCatTags, addCat, updateCat } = useOnboarding()

  const { personalityOptions, appearanceOptions } = useTagOptions()
  const { selectedPersonality, selectedAppearance, toggleTag, hasSelection, toInterestStrings } =
    useTagSelection({
      savedInterests: draft.catTags,
      personalityOptions,
      appearanceOptions,
    })

  const handleNext = () => {
    const tags = toInterestStrings()
    setCatTags(tags)

    if (draft.catProfile?.name) {
      const catData = {
        name: draft.catProfile.name,
        gender: draft.catProfile.gender,
        birthDate: draft.catProfile.birthDate,
        breed: draft.catProfile.breed,
        imageUrl: draft.catProfile.imageUrl,
        personalities:
          tags
            ?.filter((tag) => tag.startsWith("personality:"))
            .map((tag) => Number(tag.split(":")[1])) || [],
        appearances:
          tags
            ?.filter((tag) => tag.startsWith("appearance:"))
            .map((tag) => Number(tag.split(":")[1])) || [],
      }

      if (draft.editingCatIndex !== undefined && draft.editingCatIndex >= 0) {
        updateCat(draft.editingCatIndex, catData)
      } else {
        const isAlreadyAdded = draft.cats?.some(
          (cat) =>
            cat.name === draft.catProfile?.name &&
            cat.birthDate === draft.catProfile?.birthDate &&
            cat.breed === draft.catProfile?.breed
        )

        if (!isAlreadyAdded) {
          addCat(catData)
        }
      }
    }

    router.push("/onboarding/cat-profile/complete")
  }

  const personalityRows = renderTagRows(personalityOptions, 3)
  const appearanceRows = [
    appearanceOptions.slice(0, 3),
    ...renderTagRows(appearanceOptions.slice(3), 4),
  ]

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="scrollbar-hide flex-1 overflow-y-auto">
        <p className="text-text-primary mb-3 text-lg leading-7 font-bold">
          고양이의 성격과 외모를
          <br />
          태그로 선택해 주세요!
        </p>

        <div className="mt-8 flex flex-col gap-10">
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
        </div>
      </div>

      <div className="flex flex-shrink-0 flex-col gap-1.5 pt-4">
        <Button className="w-full" disabled={!hasSelection} onClick={handleNext}>
          다음으로
        </Button>
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => {
            setCatTags([])

            if (draft.catProfile?.name) {
              const catData = {
                name: draft.catProfile.name,
                gender: draft.catProfile.gender,
                birthDate: draft.catProfile.birthDate,
                breed: draft.catProfile.breed,
                imageUrl: draft.catProfile.imageUrl,
                personalities: [],
                appearances: [],
              }

              if (draft.editingCatIndex !== undefined && draft.editingCatIndex >= 0) {
                updateCat(draft.editingCatIndex, catData)
              } else {
                const isAlreadyAdded = draft.cats?.some(
                  (cat) =>
                    cat.name === draft.catProfile?.name &&
                    cat.birthDate === draft.catProfile?.birthDate &&
                    cat.breed === draft.catProfile?.breed
                )
                if (!isAlreadyAdded) {
                  addCat(catData)
                }
              }
            }

            router.push("/onboarding/cat-profile/complete")
          }}
        >
          건너뛰기
        </Button>
      </div>
    </div>
  )
}
