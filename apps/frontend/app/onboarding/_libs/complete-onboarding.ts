import { registerUser, type RegisterUserPayload } from "./register-user"
import { createCats, type CatCreationResult } from "./create-cats"
import { uploadCatImages } from "./upload-cat-images"
import type { CatData } from "@/components/onboarding/onboarding-context"

export interface CompleteOnboardingParams {
  nickname: string
  hasCat: boolean
  favoritePersonalities: number[]
  favoriteAppearances: number[]
  cats: CatData[]
}

export interface CompleteOnboardingResult {
  success: boolean
  failedCatCount?: number
}

/**
 * 온보딩 완료: 회원가입, 고양이 생성, 이미지 업로드를 순차적으로 처리
 */
export async function completeOnboarding(
  params: CompleteOnboardingParams
): Promise<CompleteOnboardingResult> {
  try {
    // 1. 회원가입
    const userPayload: RegisterUserPayload = {
      nickname: params.nickname,
      hasAgreedToTerms: true,
      isLivingWithCat: params.hasCat,
      favoritePersonalities: params.favoritePersonalities,
      favoriteAppearances: params.favoriteAppearances,
      phone: null,
      profileImageUrl: null,
    }

    await registerUser(userPayload)

    // 2. 고양이들 생성 (이미지 없이)
    let catResults: CatCreationResult[] = []
    let failedCatCount = 0

    if (params.cats.length > 0) {
      catResults = await createCats(params.cats)
      failedCatCount = params.cats.length - catResults.length

      // 3. 각 고양이의 이미지 업로드 및 업데이트
      if (catResults.length > 0) {
        await uploadCatImages(catResults)
      }
    }

    return {
      success: true,
      failedCatCount,
    }
  } catch (error) {
    console.error("[onboarding] failed to complete onboarding:", error)
    throw error
  }
}

