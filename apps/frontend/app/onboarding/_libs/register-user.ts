import { fetcherWithAuth } from "../../../lib/utils"

export interface RegisterUserPayload {
  nickname: string
  hasAgreedToTerms: boolean
  isLivingWithCat: boolean
  favoritePersonalities: number[]
  favoriteAppearances: number[]
  phone: null
  profileImageUrl: null
}

export async function registerUser(payload: RegisterUserPayload): Promise<void> {
  const response = await fetcherWithAuth.post("user", {
    json: payload,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || response.statusText)
  }
}

