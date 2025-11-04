"use client"

import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { valibotResolver } from "@hookform/resolvers/valibot"
import * as v from "valibot"
import { OnboardingHeader } from "@/components/onboarding/header"
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

  const onSubmit = (data: HasCatFormData) => {
    console.log(data)
    // TODO: 다음 단계로 이동
  }

  const handleSelect = (value: boolean) => {
    setValue("hasCat", value, { shouldValidate: true })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col min-h-screen px-3 pb-16">
      <div className="flex-1">
        <OnboardingHeader currentStep={2} onBack={() => router.back()} />
        <p className="text-lg font-bold text-foreground leading-7 mb-6">
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

      <Button
        type="submit"
        disabled={!isValid || hasCat === undefined}
        className="w-full mt-auto mb-16"
      >
        다음
      </Button>
    </form>
  )
}

