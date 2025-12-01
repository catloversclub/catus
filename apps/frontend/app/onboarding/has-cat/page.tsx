"use client"

import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { valibotResolver } from "@hookform/resolvers/valibot"
import * as v from "valibot"
import { Button } from "@/components/ui/button"
import { Chip } from "@/components/ui/chip"
import { useRouter } from "next/navigation"
import { useOnboarding } from "@/components/onboarding/onboarding-context"
import { hasCatSchema } from "../_libs/schemas"

type HasCatFormData = v.InferInput<typeof hasCatSchema>

export default function HasCatPage() {
  const router = useRouter()
  const { setHasCat, draft } = useOnboarding()

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { isValid },
  } = useForm<HasCatFormData>({
    resolver: valibotResolver(hasCatSchema),
    defaultValues: {
      hasCat: draft.hasCat,
    },
  })

  const hasCat = watch("hasCat")

  useEffect(() => {
    if (hasCat === draft.hasCat) {
      return
    }
    setHasCat(hasCat)
  }, [hasCat, setHasCat, draft.hasCat])

  const onSubmit = () => {
    if (hasCat) {
      router.push("/onboarding/cat-profile")
    } else {
      router.push("/onboarding/interests")
    }
  }

  const handleSelect = (value: boolean) => {
    setValue("hasCat", value, { shouldValidate: true })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col">
      <div className="flex-1">
        <p className="text-foreground mb-6 text-lg leading-7 font-bold">
          지금 고양이와 살고 있나요?
        </p>
        <div className="flex gap-3">
          <Chip
            variant={hasCat === true ? "selected" : "default"}
            onClick={() => handleSelect(true)}
            className="flex-1"
          >
            네
          </Chip>
          <Chip
            variant={hasCat === false ? "selected" : "default"}
            onClick={() => handleSelect(false)}
            className="flex-1"
          >
            아니오
          </Chip>
        </div>
      </div>

      <Button type="submit" disabled={!isValid || hasCat === undefined} className="mt-auto w-full">
        다음
      </Button>
    </form>
  )
}
