"use client"

import { FaArrowLeft } from "react-icons/fa6"
import { OnboardingProgress } from "./progress"

interface OnboardingHeaderProps {
  currentStep: number
  onBack: () => void
}

export function OnboardingHeader({ currentStep, onBack }: OnboardingHeaderProps) {
  return (
    <div className="flex flex-col gap-6 mt-8">
      <FaArrowLeft className="size-5 cursor-pointer" onClick={onBack} />
      <OnboardingProgress currentStep={currentStep} className="mb-10" />
    </div>
  )
}

