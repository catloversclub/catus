import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    idToken?: string
    refreshToken?: string
    accessTokenExpires?: number
    onboardingRequired?: boolean
    user: {
      id: string
      name?: string | null
      image?: string | null
    }
  }

  interface JWT {
    accessToken?: string
    refreshToken?: string
    idToken?: string
    accessTokenExpires?: number
    userId?: string
    userName?: string
    userImage?: string
    error?: string
    onboardingRequired?: boolean
  }
}
