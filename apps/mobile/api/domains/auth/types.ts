export type AuthProvider = "kakao" | "google" | "apple"

export interface OidcExchangeRequest {
  idToken: string
  provider: AuthProvider
}

export interface OidcExchangeResponse {
  onboardingRequired: boolean
  accessToken: string
  refreshToken: string | null
}
