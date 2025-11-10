"use client"

import { useRouter } from "next/navigation"
import { OnboardingHeader } from "@/components/onboarding/header"

export default function OnboardingInterestsPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen px-3 pb-16">
      <OnboardingHeader currentStep={6} onBack={() => router.back()} />
      <div className="flex-1 flex items-center justify-center text-text-tertiary text-sm">
        관심 태그 설정 페이지 (준비 중)
      </div>
    </div>
  )
}

