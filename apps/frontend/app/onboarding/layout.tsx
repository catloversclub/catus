"use client"

import type { ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"
import { OnboardingProvider } from "@/components/onboarding/onboarding-context"
import { OnboardingHeader } from "@/components/onboarding/header"

const STEP_MAP: Record<
  string,
  {
    step?: number
    showProgress?: boolean
  }
> = {
  "/onboarding/nickname": { step: 1, showProgress: true },
  "/onboarding/has-cat": { step: 2, showProgress: true },
  "/onboarding/cat-profile": { step: 3, showProgress: true },
  "/onboarding/interests": { step: 6, showProgress: true },
  "/onboarding/complete": { step: 6, showProgress: false },
}

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { step = 1, showProgress = true } = STEP_MAP[pathname] ?? {}

  return (
    <OnboardingProvider>
      <div className="flex min-h-screen flex-col px-3 pb-16">
        <OnboardingHeader
          currentStep={step}
          showProgress={showProgress}
          onBack={() => router.back()}
        />
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </OnboardingProvider>
  )
}
