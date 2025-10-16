import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { createRemoteJWKSet, jwtVerify, JWTPayload } from "jose"

@Injectable()
export class KakaoJwtVerifier {
  private readonly issuer = "https://kauth.kakao.com"
  private readonly audience: string
  private readonly jwks = createRemoteJWKSet(
    new URL("https://kauth.kakao.com/.well-known/jwks.json"),
  )

  constructor(private readonly config: ConfigService) {
    const clientId = this.config.get<string>("KAKAO_CLIENT_ID")
    if (!clientId) {
      throw new Error("KAKAO_CLIENT_ID is not configured")
    }
    this.audience = clientId
  }

  async verifyIdToken(idToken: string): Promise<JWTPayload> {
    const { payload } = await jwtVerify(idToken, this.jwks, {
      issuer: this.issuer,
      audience: this.audience,
    })
    return payload
  }
}
