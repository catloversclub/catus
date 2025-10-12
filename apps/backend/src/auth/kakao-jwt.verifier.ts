import { Injectable } from "@nestjs/common"
import { createRemoteJWKSet, jwtVerify, JWTPayload } from "jose"

@Injectable()
export class KakaoJwtVerifier {
  private readonly issuer = "https://kauth.kakao.com"
  private readonly audience = process.env.KAKAO_CLIENT_ID!
  private readonly jwks = createRemoteJWKSet(
    new URL("https://kauth.kakao.com/.well-known/jwks.json"),
  )

  async verifyIdToken(idToken: string): Promise<JWTPayload> {
    const { payload } = await jwtVerify(idToken, this.jwks, {
      issuer: this.issuer,
      audience: this.audience,
    })
    return payload
  }
}
