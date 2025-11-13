import type { Session } from "next-auth"
import type { JWT } from "next-auth/jwt"
import type { Profile as NextAuthProfile } from "next-auth"

export interface ExtendedSession extends Session {
  token?: {
    accessTokenExpires?: number
  }
}

export type KakaoProfile = NextAuthProfile & {
  sub?: string | number
  id?: string | number
  nickname?: string | null
  picture?: string | null
  image?: string | null
  kakao_account?: {
    profile?: {
      nickname?: string | null
      profile_image_url?: string | null
    }
  }
}

export type RefreshableToken = JWT & {
  refreshToken?: string
  accessToken?: string
  accessTokenExpires?: number
}
