"use client"

import type { ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"
import { OnboardingProvider } from "@/components/onboarding/onboarding-context"
import { OnboardingHeader } from "@/components/onboarding/header"

const STEP_MAP: Record<string, number> = {
  "/onboarding/nickname": 1,
  "/onboarding/has-cat": 2,
  "/onboarding/cat-profile": 3,
  "/onboarding/interests": 6,
}

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const currentStep = STEP_MAP[pathname] ?? 1

  return (
    <OnboardingProvider>
      <div className="flex min-h-screen flex-col px-3 pb-16">
        <OnboardingHeader currentStep={currentStep} onBack={() => router.back()} />
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </OnboardingProvider>
  )
}


