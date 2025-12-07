"use client"

import { useEffect, useRef } from "react"
import { useOnboarding } from "@/components/onboarding/onboarding-context"

export function useAddCurrentCat() {
  const { draft, addCat } = useOnboarding()
  const processedRef = useRef<string | null>(null)

  useEffect(() => {
    if (draft.editingCatIndex !== undefined && draft.editingCatIndex >= 0) {
      return
    }

    if (!draft.catProfile?.name) {
      processedRef.current = null
      return
    }

    const catData = {
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
    }

    const catTagsKey = draft.catTags?.sort().join(",") || ""
    const currentKey = `new-${draft.catProfile.name}-${draft.catProfile.birthDate}-${draft.catProfile.breed}-${draft.catProfile.gender}-${draft.catProfile.imageUrl}-${catTagsKey}`

    if (processedRef.current === currentKey) {
      return
    }

    const isAlreadyAdded = draft.cats?.some(
      (cat) =>
        cat.name === draft.catProfile?.name &&
        cat.birthDate === draft.catProfile?.birthDate &&
        cat.breed === draft.catProfile?.breed
    )

    if (!isAlreadyAdded) {
      addCat(catData)
      processedRef.current = currentKey
    }
  }, [draft.catProfile, draft.catTags, draft.editingCatIndex, draft.cats, addCat])
}

