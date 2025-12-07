"use client"

import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { valibotResolver } from "@hookform/resolvers/valibot"
import * as v from "valibot"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Chip } from "@/components/ui/chip"
import { useRouter } from "next/navigation"
import { useOnboarding } from "@/components/onboarding/onboarding-context"
import { catGenderOptions, catProfileSchema, type CatGender } from "../_libs/schemas"
import { CatImageUpload } from "@/components/onboarding/cat-image-upload"
import { DatePickerSheet } from "@/components/onboarding/date-picker-sheet"
import { BreedAutocomplete } from "@/components/onboarding/breed-autocomplete"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type CatProfileFormData = v.InferInput<typeof catProfileSchema>

export default function CatProfilePage() {
  const router = useRouter()
  const { setCatProfile, draft } = useOnboarding()
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [_imageFile, setImageFile] = useState<File | null>(null)

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
    router.push("/onboarding/cat-profile/tags")
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col">
      <p className="text-text-primary mb-3 text-lg leading-7 font-bold">
        고양이의 프로필을 완성해 주세요!
      </p>
      <p className="text-text-secondary mb-10 text-base font-semibold">
        여러 마리의 고양이가 있다면
        <br />
        다음 화면에서 ‘더 추가하기’를 클릭해주세요.
      </p>

      <div className="flex flex-1 flex-col gap-10">
        <CatImageUpload value={draft.catProfile?.imageUrl} onChange={handleImageChange} />

        <div>
          <label className="text-foreground block text-xs font-normal">이름</label>
          <Input
            {...register("name")}
            placeholder="고양이 이름을 입력해주세요"
            maxLength={12}
            className="h-12"
          />
          {errors.name && (
            <p className="text-text-error mt-1.5 text-[10px]">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="text-foreground mb-2 block text-xs font-normal">성별</label>
          <div className="flex gap-3">
            {catGenderOptions.map(({ value, label }) => (
              <Chip
                key={value}
                variant={gender === value ? "selected" : "default"}
                onClick={() => handleGenderSelect(value)}
                className="flex-1"
              >
                {label}
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <label className="text-foreground mb-2 block text-xs font-normal">생일 (선택)</label>
          <button
            type="button"
            onClick={() => setDatePickerOpen(true)}
            className="bg-background-secondary text-foreground h-12 w-full rounded px-3 text-left transition-colors"
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
          <label className="text-foreground mb-2 block text-xs font-normal">품종 (선택)</label>
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
          <SkipButton />
        </div>
      </div>
    </form>
  )
}

function SkipButton() {
  const router = useRouter()
  const { setCatProfile, setCatTags } = useOnboarding()

  const handleConfirmSkip = () => {
    setCatProfile(undefined)
    setCatTags([])
    router.push("/onboarding/interests")
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="ghost" className="w-full">
          건너뛰기
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-[328px]">
        <AlertDialogHeader>
          <AlertDialogTitle>
            건너뛰면 지금까지 작성한 내용이 사라져요.
            <br />
            프로필을 이어서 작성할까요?
          </AlertDialogTitle>
          <AlertDialogDescription className="mb-6">
            지금 작성한 내용은 마이페이지에서 수정할 수 있어요.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="grid grid-cols-2 gap-2">
          <Button variant="outline" className="h-12" onClick={handleConfirmSkip}>
            건너뛰기
          </Button>
          <AlertDialogAction asChild>
            <Button className="h-12">작성하기</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
