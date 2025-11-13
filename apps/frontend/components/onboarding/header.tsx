"use client"

import { FaArrowLeft } from "react-icons/fa6"
import { OnboardingProgress } from "./progress"

interface OnboardingHeaderProps {
  currentStep: number
  onBack: () => void
  showProgress?: boolean
}

export function OnboardingHeader({
  currentStep,
  onBack,
  showProgress = true,
}: OnboardingHeaderProps) {
  return (
    <div className="flex flex-col gap-6 mt-8">
      <FaArrowLeft className="size-5 cursor-pointer" onClick={onBack} />
      {showProgress && <OnboardingProgress currentStep={currentStep} className="mb-10" />}
    </div>
  )
}

