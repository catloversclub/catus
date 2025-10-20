import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    user: {
      id: string
      name?: string | null
      image?: string | null
    }
  }

  interface JWT {
    accessToken?: string
    refreshToken?: string
    accessTokenExpires?: number
    userId?: string
    error?: string
  }
}
