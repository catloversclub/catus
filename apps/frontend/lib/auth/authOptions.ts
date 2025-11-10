import { NextAuthOptions } from "next-auth"
import KakaoProvider from "next-auth/providers/kakao"

export const authOptions: NextAuthOptions = {
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
      issuer: "https://kauth.kakao.com",
      wellKnown: "https://kauth.kakao.com/.well-known/openid-configuration",
      idToken: true,
      checks: ["nonce"],
      authorization: {
        params: {
          scope: "openid profile_nickname profile_image",
          prompt: "login",
          response_type: "code",
          force_login: "true",
        },
      },
      profile(profile: any) {
        const id = (profile?.sub ?? profile?.id)?.toString()
        const name =
          profile?.name ??
          profile?.nickname ??
          profile?.kakao_account?.profile?.nickname ??
          null
        const image =
          profile?.picture ??
          profile?.image ??
          profile?.kakao_account?.profile?.profile_image_url ??
          null
        return { id, name, image }
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
      if (account) {
        token.accessToken = account.access_token ?? (token.accessToken as string | undefined)
        token.refreshToken = account.refresh_token ?? (token.refreshToken as string | undefined)
        token.idToken = account.id_token ?? (token.idToken as string | undefined)
        token.accessTokenExpires = account.expires_at
          ? account.expires_at * 1000
          : (token.accessTokenExpires as number | undefined) ?? Date.now() + 60 * 60 * 1000

        const profileData = profile as Record<string, unknown> | undefined
        const profileId =
          (profileData?.id as string | number | undefined) ??
          (profileData?.sub as string | number | undefined) ??
          account.providerAccountId
        if (profileId) {
          token.userId = profileId.toString()
        }

        const name =
          (profileData?.name as string | undefined) ??
          (profileData?.nickname as string | undefined)
        if (name) {
          token.userName = name
        }

        const image =
          (profileData?.image as string | undefined) ??
          (profileData?.picture as string | undefined) ??
          (profileData?.kakao_account as any)?.profile?.profile_image_url
        if (image) {
          token.userImage = image
        }
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token
      }

      // Access token has expired, try to update it
      return await refreshAccessToken(token)
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined
      session.idToken = token.idToken as string | undefined

      session.user = session.user ?? { id: "" }
      if (token.userId) {
        session.user.id = token.userId as string
      }
      if (token.userName) {
        session.user.name = token.userName as string
      }
      if (token.userImage) {
        session.user.image = token.userImage as string
      }

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
