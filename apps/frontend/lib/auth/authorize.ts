interface TokenData {
  refreshToken?: string
  accessToken?: string
  accessTokenExpires?: number
  error?: string
}

interface RefreshTokenResponse {
  access_token: string
  expires_in: number
  refresh_token?: string
}

export const authorize = async (token: TokenData): Promise<TokenData> => {
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

    const refreshedTokens: RefreshTokenResponse = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    }
  } catch (error) {
    console.error("Error refreshing access token:", error)
    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}
