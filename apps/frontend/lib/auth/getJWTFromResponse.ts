interface TokenResponse {
  access_token: string
  expires_in: number
  refresh_token?: string
}

interface JWTData {
  accessToken: string
  accessTokenExpires: number
  refreshToken?: string
}

export const getJWTFromResponse = (response: TokenResponse): JWTData => {
  return {
    accessToken: response.access_token,
    accessTokenExpires: Date.now() + response.expires_in * 1000,
    refreshToken: response.refresh_token,
  }
}
