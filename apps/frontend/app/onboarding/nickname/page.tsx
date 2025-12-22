"use client"

import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { valibotResolver } from "@hookform/resolvers/valibot"
import * as v from "valibot"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FaXmark } from "react-icons/fa6"
import { useRouter } from "next/navigation"
import { useOnboarding } from "@/components/onboarding/onboarding-context"
import { cn } from "@/lib/utils"
import { NICKNAME_MAX_LEN, nicknameSchema } from "../_libs/schemas"

type NicknameFormData = v.InferInput<typeof nicknameSchema>

export default function NicknamePage() {
  const router = useRouter()
  const { setNickname, draft } = useOnboarding()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isValid, touchedFields },
  } = useForm<NicknameFormData>({
    resolver: valibotResolver(nicknameSchema),
    mode: "onChange",
    defaultValues: {
      nickname: draft.nickname || "",
    },
  })

  const nickname = watch("nickname")

  useEffect(() => {
    if (nickname === (draft.nickname || "")) {
      return
    }
    setNickname(nickname || undefined)
  }, [nickname, setNickname, draft.nickname])

  // 실시간 validation
  useEffect(() => {
    if (nickname) {
      trigger("nickname")
    }
  }, [nickname, trigger])

  const onSubmit = () => {
    router.push("/onboarding/has-cat")
  }

  const handleClear = () => {
    setValue("nickname", "", { shouldValidate: false })
  }

  const isTouched = touchedFields.nickname
  const hasError = !!errors.nickname
  const isValidNickname = isValid && nickname && nickname.length > 0

  const status: "idle" | "invalid" | "ok" = !isTouched
    ? "idle"
    : hasError
      ? "invalid"
      : isValidNickname
        ? "ok"
        : "idle"

  const borderClass =
    !isTouched || !nickname
      ? ""
      : hasError
        ? "border-border-error focus-visible:ring-ring-error"
        : "border-border-success focus-visible:ring-ring-success"

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
      <div className="scrollbar-hide flex-1 overflow-y-auto">
        <p className="text-foreground mb-6 text-lg leading-7 font-bold">닉네임을 입력해주세요</p>
        <NicknameField {...register("nickname")} onClear={handleClear} borderClass={borderClass} />
        <FeedbackText status={status} />
      </div>

      <div className="flex flex-shrink-0 pt-4">
        <Button type="submit" disabled={!isValidNickname} className="w-full">
          다음으로
        </Button>
      </div>
    </form>
  )
}

interface NicknameFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear: () => void
  borderClass: string
}

function NicknameField({ onClear, borderClass, ...inputProps }: NicknameFieldProps) {
  const value = inputProps.value as string

  return (
    <div className="relative">
      <Input
        {...inputProps}
        placeholder="닉네임"
        maxLength={NICKNAME_MAX_LEN}
        className={cn("h-12 pr-10", borderClass)}
      />
      {value && (
        <Button
          type="button"
          aria-label="입력 초기화"
          onClick={onClear}
          variant="ghost"
          size="icon"
          className="absolute top-1/2 right-2 size-8 -translate-y-1/2 p-0"
        >
          <FaXmark className="size-4" />
        </Button>
      )}
    </div>
  )
}

interface FeedbackTextProps {
  status: "idle" | "invalid" | "ok"
}

function FeedbackText({ status }: FeedbackTextProps) {
  const helpText =
    status === "ok"
      ? "사용할 수 있는 닉네임이에요"
      : status === "invalid"
        ? "사용할 수 없는 닉네임이에요"
        : "최대 16자, 한글/영문/숫자만 입력 가능"

  const colorClass =
    status === "ok"
      ? "text-text-success"
      : status === "invalid"
        ? "text-text-error"
        : "text-text-tertiary"

  return <p className={cn("mt-1.5 text-[10px]", colorClass)}>{helpText}</p>
}
