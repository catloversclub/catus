import { SetMetadata } from "@nestjs/common"

export const ONBOARDING_BYPASS_KEY = "onboarding_bypass"

export const OnboardingBypass = () => SetMetadata(ONBOARDING_BYPASS_KEY, true)
