import { cn } from "@/lib/utils"

interface OnboardingProgressProps {
  currentStep: number
  totalSteps?: number
  className?: string
}

export function OnboardingProgress({
  currentStep,
  totalSteps = 6,
  className,
}: OnboardingProgressProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1)
  return (
    <div className={cn("flex items-center gap-[6px]", className)}>
      {steps.map((step) => (
        <div
          key={step}
          className={cn(
            "h-2 flex-1 rounded-xs",
            step <= currentStep ? "bg-icon-accent" : "bg-background-secondary"
          )}
        />
      ))}
    </div>
  )
}
