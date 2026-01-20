import type { NextAuthOptions } from "next-auth"
import KakaoProvider from "next-auth/providers/kakao"
import type { KakaoProfile, RefreshableToken } from "./types"

type OidcExchangeResponse = {
  onboardingRequired: boolean
  accessToken: string
  refreshToken: string | null
}

type RefreshResponse = {
  accessToken: string
  refreshToken: string
}

function getApiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.catus.app").replace(/\/$/, "")
}

function decodeJwtPayload<T = unknown>(jwt: string): T | null {
  const parts = jwt.split(".")
  if (parts.length < 2) return null

  const base64Url = parts[1]
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
  const pad = base64.length % 4 === 0 ? "" : "=".repeat(4 - (base64.length % 4))

  try {
    const json = Buffer.from(base64 + pad, "base64").toString("utf8")
    return JSON.parse(json) as T
  } catch {
    return null
  }
}

function getJwtExpMs(jwt: string): number | null {
  const payload = decodeJwtPayload<{ exp?: number }>(jwt)
  return payload?.exp ? payload.exp * 1000 : null
}

function getJwtSub(jwt: string): string | null {
  const payload = decodeJwtPayload<{ sub?: string }>(jwt)
  const sub = payload?.sub?.trim()
  return sub && sub.length > 0 ? sub : null
}

function getJwtTyp(jwt: string): string | null {
  const payload = decodeJwtPayload<{ typ?: string }>(jwt)
  return payload?.typ ?? null
}

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
      profile(profile: KakaoProfile) {
        const id = (profile?.sub ?? profile?.id ?? "").toString()
        const name =
          profile?.name ?? profile?.nickname ?? profile?.kakao_account?.profile?.nickname ?? null
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
        token.idToken = account.id_token ?? (token.idToken as string | undefined)
        token.onboardingRequired = undefined
        // Clear any legacy tokens from previous versions (e.g. Kakao refresh token)
        token.refreshToken = undefined

        // Exchange OIDC id_token -> app-issued access/refresh tokens.
        if (token.idToken) {
          const apiBaseUrl = getApiBaseUrl()
          try {
            const res = await fetch(`${apiBaseUrl}/auth/oidc/exchange`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                idToken: token.idToken,
                provider: account.provider,
              }),
            })

            if (!res.ok) {
              const text = await res.text().catch(() => "")
              console.error("[auth] oidc exchange failed", { status: res.status, body: text })
              // Fallback (backend still accepts OIDC id_token as Bearer during migration)
              token.accessToken = token.idToken
              token.refreshToken = undefined
              token.onboardingRequired = undefined
              token.accessTokenExpires =
                getJwtExpMs(token.idToken as string) ??
                ((token.accessTokenExpires as number | undefined) ?? Date.now() + 60 * 60 * 1000)
              token.error = "OidcExchangeFailed"
            } else {
              const exchanged = (await res.json()) as OidcExchangeResponse
              token.accessToken = exchanged.accessToken
              token.refreshToken = exchanged.refreshToken ?? undefined
              token.onboardingRequired = exchanged.onboardingRequired
              token.accessTokenExpires =
                getJwtExpMs(exchanged.accessToken) ?? Date.now() + 15 * 60 * 1000
            }
          } catch (e) {
            console.error("[auth] oidc exchange request failed", e)
            // Fallback (backend still accepts OIDC id_token as Bearer during migration)
            token.accessToken = token.idToken
            token.refreshToken = undefined
            token.onboardingRequired = undefined
            token.accessTokenExpires =
              getJwtExpMs(token.idToken as string) ??
              ((token.accessTokenExpires as number | undefined) ?? Date.now() + 60 * 60 * 1000)
            token.error = "OidcExchangeFetchFailed"
          }
        }

        const profileData = profile as KakaoProfile | undefined
        const profileId =
          (profileData?.id as string | number | undefined) ??
          (profileData?.sub as string | number | undefined) ??
          account.providerAccountId
        if (profileId) {
          token.userId = profileId.toString()
        }

        // If app access token includes a user id (sub), prefer it.
        const appUserId = token.accessToken ? getJwtSub(token.accessToken as string) : null
        if (appUserId) {
          token.userId = appUserId
        }

        const name =
          (profileData?.name as string | undefined) ?? (profileData?.nickname as string | undefined)
        if (name) {
          token.userName = name
        }

        const image =
          (profileData?.image as string | undefined) ??
          (profileData?.picture as string | undefined) ??
          profileData?.kakao_account?.profile?.profile_image_url
        if (image) {
          token.userImage = image
        }
      }

      // Defensive: if refreshToken is not an app-issued JWT refresh token, drop it.
      if (token.refreshToken) {
        const typ = getJwtTyp(token.refreshToken as string)
        if (typ !== "refresh") {
          token.refreshToken = undefined
        }
      }

      // If accessTokenExpires is missing but token is a JWT, infer from exp.
      if (!token.accessTokenExpires && token.accessToken) {
        const expMs = getJwtExpMs(token.accessToken as string)
        if (expMs) token.accessTokenExpires = expMs
      }

      // If onboarding just finished, the previously issued access token may still have sub=null.
      // Re-run OIDC exchange with the stored idToken to "upgrade" to a user-bound access/refresh token.
      if (token.onboardingRequired && token.idToken) {
        const apiBaseUrl = getApiBaseUrl()
        try {
          const res = await fetch(`${apiBaseUrl}/auth/oidc/exchange`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken: token.idToken }),
          })

          if (res.ok) {
            const exchanged = (await res.json()) as OidcExchangeResponse
            token.accessToken = exchanged.accessToken
            token.refreshToken = exchanged.refreshToken ?? undefined
            token.onboardingRequired = exchanged.onboardingRequired
            token.accessTokenExpires = getJwtExpMs(exchanged.accessToken) ?? Date.now() + 15 * 60 * 1000
          }
        } catch (e) {
          console.error("[auth] oidc re-exchange failed", e)
        }
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires as number) - 30_000) {
        return token
      }

      // Access token has expired, try to update it
      return await refreshAccessToken(token)
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined
      session.idToken = token.idToken as string | undefined
      session.refreshToken = token.refreshToken as string | undefined
      session.accessTokenExpires = token.accessTokenExpires as number | undefined
      session.onboardingRequired = token.onboardingRequired as boolean | undefined

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

async function refreshAccessToken(token: RefreshableToken) {
  try {
    if (!token.refreshToken || getJwtTyp(token.refreshToken as string) !== "refresh") {
      return { ...token, error: "RefreshAccessTokenError" }
    }

    const apiBaseUrl = getApiBaseUrl()
    const response = await fetch(`${apiBaseUrl}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: token.refreshToken as string,
      }),
    })

    const refreshedTokens = (await response.json()) as RefreshResponse

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.accessToken,
      accessTokenExpires: getJwtExpMs(refreshedTokens.accessToken) ?? Date.now() + 15 * 60 * 1000,
      refreshToken: refreshedTokens.refreshToken ?? (token.refreshToken as string),
    }
  } catch (error) {
    console.error("Error refreshing access token:", error)

    // If refresh token is invalid/rotated, try re-exchange with stored idToken (if any).
    if (token.idToken) {
      try {
        const apiBaseUrl = getApiBaseUrl()
        const res = await fetch(`${apiBaseUrl}/auth/oidc/exchange`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: token.idToken }),
        })
        if (res.ok) {
          const exchanged = (await res.json()) as OidcExchangeResponse
          return {
            ...token,
            accessToken: exchanged.accessToken,
            accessTokenExpires: getJwtExpMs(exchanged.accessToken) ?? Date.now() + 15 * 60 * 1000,
            refreshToken: exchanged.refreshToken ?? undefined,
            onboardingRequired: exchanged.onboardingRequired,
            error: undefined,
          }
        }
      } catch (e) {
        console.error("[auth] oidc re-exchange after refresh failure failed", e)
      }
    }

    return {
      ...token,
      refreshToken: undefined,
      error: "RefreshAccessTokenError",
    }
  }
}
