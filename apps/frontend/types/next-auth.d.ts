import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    idToken?: string
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
    error?: string
  }
}
