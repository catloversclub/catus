import { NextAuthOptions } from "next-auth"
import KakaoProvider from "next-auth/providers/kakao"

interface KakaoProfile {
  id: number
  connected_at: string
  properties: {
    nickname: string
    profile_image: string
    thumbnail_image: string
  }
  kakao_account: {
    profile_nickname_needs_agreement: boolean
    profile_image_needs_agreement: boolean
    profile: {
      nickname: string
      thumbnail_image_url: string
      profile_image_url: string
      is_default_image: boolean
      is_default_nickname: boolean
    }
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
      idToken: true,
      authorization: {
        params: {
          scope: "openid profile_nickname profile_image",
          prompt: "login",
          response_type: "code",
          force_login: "true",
        },
      },
      profile(profile: KakaoProfile) {
        return {
          id: profile.id.toString(),
          name: profile.kakao_account.profile.nickname,
          image: profile.kakao_account.profile.profile_image_url,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      // Initial sign in
      if (account && profile) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.idToken = account.id_token // 카카오 OpenID Connect에서 받은 id_token
        token.accessTokenExpires = account.expires_at
          ? account.expires_at * 1000
          : Date.now() + 60 * 60 * 1000
        token.userId = (profile as KakaoProfile).id.toString()
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token
      }

      // Access token has expired, try to update it
      return await refreshAccessToken(token)
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.idToken = token.idToken as string
      session.user.id = token.userId as string
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
}

async function refreshAccessToken(token: Record<string, unknown>) {
  try {
    const response = await fetch("https://kauth.kakao.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: process.env.KAKAO_CLIENT_ID!,
        client_secret: process.env.KAKAO_CLIENT_SECRET!,
        refresh_token: token.refreshToken as string,
      }),
    })

    const refreshedTokens = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? (token.refreshToken as string), // Fall back to old refresh token
    }
  } catch (error) {
    console.error("Error refreshing access token:", error)
    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}
