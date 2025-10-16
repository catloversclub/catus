import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import type { JWTPayload, GetKeyFunction, JWSHeaderParameters, FlattenedJWSInput } from "jose"

type JWKGetter = GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput>

@Injectable()
export class KakaoJwtVerifier {
  private readonly issuer = "https://kauth.kakao.com"
  private readonly audience: string
  private readonly jwksPromise: Promise<JWKGetter>

  constructor(private readonly config: ConfigService) {
    const clientId = this.config.get<string>("KAKAO_CLIENT_ID")
    if (!clientId) throw new Error("KAKAO_CLIENT_ID is not configured")
    this.audience = clientId

    this.jwksPromise = import("jose").then(({ createRemoteJWKSet }) =>
      createRemoteJWKSet(new URL("https://kauth.kakao.com/.well-known/jwks.json")),
    )
  }

  async verifyIdToken(idToken: string): Promise<JWTPayload> {
    const { jwtVerify } = await import("jose")
    const jwks = await this.jwksPromise
    const { payload } = await jwtVerify(idToken, jwks, {
      issuer: this.issuer,
      audience: this.audience,
    })
    return payload as JWTPayload
  }
}
