"use client"

import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { valibotResolver } from "@hookform/resolvers/valibot"
import * as v from "valibot"
import { OnboardingHeader } from "@/components/onboarding/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Chip } from "@/components/ui/chip"
import { useRouter } from "next/navigation"
import { useOnboarding } from "@/components/onboarding/onboarding-context"
import { catProfileSchema, type CatGender } from "../_libs/schemas"
import { CatImageUpload } from "@/components/onboarding/cat-image-upload"
import { DatePickerSheet } from "@/components/onboarding/date-picker-sheet"
import { BreedAutocomplete } from "@/components/onboarding/breed-autocomplete"

type CatProfileFormData = v.InferInput<typeof catProfileSchema>

export default function CatProfilePage() {
  const router = useRouter()
  const { setCatProfile, draft } = useOnboarding()
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<CatProfileFormData>({
    resolver: valibotResolver(catProfileSchema),
    mode: "onChange",
    defaultValues: {
      name: draft.catProfile?.name || "",
      gender: draft.catProfile?.gender || "unknown",
      birthDate: draft.catProfile?.birthDate,
      breed: draft.catProfile?.breed,
      imageUrl: draft.catProfile?.imageUrl,
    },
  })

  const name = watch("name")
  const gender = watch("gender")
  const birthDate = watch("birthDate")
  const breed = watch("breed")

  useEffect(() => {
    const currentProfile = {
      name: name || undefined,
      gender: gender || undefined,
      birthDate: birthDate || undefined,
      breed: breed || undefined,
      imageUrl: draft.catProfile?.imageUrl,
    }

    if (JSON.stringify(currentProfile) !== JSON.stringify(draft.catProfile)) {
      setCatProfile(currentProfile)
    }
  }, [name, gender, birthDate, breed, setCatProfile, draft.catProfile])

  const onSubmit = (data: CatProfileFormData) => {
    console.log(data)
    // TODO: 다음 단계로 이동
  }

  const handleGenderSelect = (selectedGender: CatGender) => {
    setValue("gender", selectedGender, { shouldValidate: true })
  }

  const handleDateChange = (date: string | null) => {
    setValue("birthDate", date || undefined, { shouldValidate: false })
  }

  const handleBreedChange = (selectedBreed: string | null) => {
    setValue("breed", selectedBreed || undefined, { shouldValidate: false })
  }

  const handleImageChange = (file: File | null, previewUrl?: string) => {
    setImageFile(file)
    // TODO: 실제 이미지 업로드 로직 구현
    if (previewUrl) {
      setValue("imageUrl", previewUrl, { shouldValidate: false })
    } else {
      setValue("imageUrl", undefined, { shouldValidate: false })
    }
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "생년월일 선택"
    const [year, month, day] = dateStr.split("-")
    return `${year}년 ${parseInt(month)}월 ${parseInt(day)}일`
  }

  const isFormValid = isValid && name && gender

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col min-h-screen px-3 pb-16">
      <div className="flex-1">
        <OnboardingHeader currentStep={3} onBack={() => router.back()} />
        <p className="text-lg font-bold text-text-primary leading-7 mb-3">
          고양이의 프로필을 완성해 주세요!
        </p>
        <p className="text-text-secondary font-semibold text-base mb-10">
          여러 마리의 고양이가 있다면
          <br />
          다음 화면에서 ‘더 추가하기’를 클릭해주세요.
        </p>

        <div className="flex flex-col gap-10">
          <CatImageUpload value={draft.catProfile?.imageUrl} onChange={handleImageChange} />

          <div>
            <label className="block text-xs font-normal text-foreground">이름</label>
            <Input
              {...register("name")}
              placeholder="고양이 이름을 입력해주세요"
              maxLength={12}
              className="h-12"
            />
            {errors.name && (
              <p className="text-text-error text-[10px] mt-1.5">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-normal text-foreground mb-2">성별</label>
            <div className="flex gap-3">
              <Chip
                variant={gender === "female" ? "selected" : "default"}
                onClick={() => handleGenderSelect("female")}
                className="flex-1"
              >
                여자
              </Chip>
              <Chip
                variant={gender === "male" ? "selected" : "default"}
                onClick={() => handleGenderSelect("male")}
                className="flex-1"
              >
                남자
              </Chip>
              <Chip
                variant={gender === "unknown" ? "selected" : "default"}
                onClick={() => handleGenderSelect("unknown")}
                className="flex-1"
              >
                선택 안 함
              </Chip>
            </div>
          </div>

          <div>
            <label className="block text-xs font-normal text-foreground mb-2">생일 (선택)</label>
            <button
              type="button"
              onClick={() => setDatePickerOpen(true)}
              className="w-full h-12 px-3 text-left rounded bg-background-secondary transition-colors text-foreground"
            >
              {formatDate(birthDate)}
            </button>
            <DatePickerSheet
              open={datePickerOpen}
              onOpenChange={setDatePickerOpen}
              value={birthDate}
              onChange={handleDateChange}
            />
          </div>

          <div>
            <label className="block text-xs font-normal text-foreground mb-2">품종 (선택)</label>
            <BreedAutocomplete
              value={breed}
              onChange={handleBreedChange}
              placeholder="품종을 검색해주세요"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Button type="submit" disabled={!isFormValid} className="w-full">
              다음으로
            </Button>
            <Button variant="ghost" className="w-full">
              건너뛰기
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
