"use client"

import type { ReactNode } from "react"
import { OnboardingProvider } from "@/components/onboarding/onboarding-context"

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return <OnboardingProvider>{children}</OnboardingProvider>
}


