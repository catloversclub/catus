"use client"

import { useEffect, useRef } from "react"
import { useOnboarding } from "@/components/onboarding/onboarding-context"

export function useAddCurrentCat() {
  const { draft, addCat } = useOnboarding()
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
  }, [draft, addCat])
}

