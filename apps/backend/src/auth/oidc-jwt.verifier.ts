import {
  Injectable,
  UnauthorizedException,
  Logger,
  InternalServerErrorException,
} from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { Provider } from "@prisma/client"
import {
  createRemoteJWKSet,
  decodeJwt,
  jwtVerify,
  type JWTHeaderParameters,
  type FlattenedJWSInput,
  type GetKeyFunction,
  type JWTPayload,
} from "jose"

type JWKGetter = GetKeyFunction<JWTHeaderParameters, FlattenedJWSInput>

type ProviderConfig = {
  provider: Provider
  issuer: string
  validIssuers: string[]
  jwksUrl: string
  audienceEnv: string
}

const PROVIDERS: ProviderConfig[] = [
  {
    provider: Provider.KAKAO,
    issuer: "https://kauth.kakao.com",
    validIssuers: ["https://kauth.kakao.com"],
    jwksUrl: "https://kauth.kakao.com/.well-known/jwks.json",
    audienceEnv: "KAKAO_CLIENT_ID",
  },
  {
    provider: Provider.GOOGLE,
    issuer: "https://accounts.google.com",
    validIssuers: ["https://accounts.google.com", "accounts.google.com"],
    jwksUrl: "https://www.googleapis.com/oauth2/v3/certs",
    audienceEnv: "GOOGLE_CLIENT_ID",
  },
  {
    provider: Provider.APPLE,
    issuer: "https://appleid.apple.com",
    validIssuers: ["https://appleid.apple.com"],
    jwksUrl: "https://appleid.apple.com/auth/keys",
    audienceEnv: "APPLE_CLIENT_ID",
  },
]

@Injectable()
export class OidcJwtVerifier {
  private readonly logger = new Logger(OidcJwtVerifier.name)

  private readonly jwksClientMap = new Map<string, JWKGetter>()
  private readonly audienceByProvider: Partial<Record<Provider, string>> = {}

  constructor(private readonly config: ConfigService) {
    for (const p of PROVIDERS) {
      const aud = this.config.get<string>(p.audienceEnv)
      if (aud) {
        this.audienceByProvider[p.provider] = aud
      } else {
        this.logger.warn(`Missing OIDC audience config: ${p.audienceEnv}`)
      }
    }
  }

  async verifyIdToken(idToken: string): Promise<{ provider: Provider; payload: JWTPayload }> {
    let iss: string | undefined
    try {
      const decoded = decodeJwt(idToken)
      iss = decoded.iss
    } catch (e) {
      throw new UnauthorizedException("Malformed token")
    }

    if (!iss) throw new UnauthorizedException("Token missing issuer")

    const providerConfig = this.resolveProvider(iss)
    if (!providerConfig) {
      throw new UnauthorizedException(`Unsupported token issuer: ${iss}`)
    }

    const audience = this.audienceByProvider[providerConfig.provider]
    if (!audience) {
      throw new InternalServerErrorException(
        `OIDC audience not configured for ${providerConfig.provider}`,
      )
    }

    const jwks = this.getJwksClient(providerConfig)

    try {
      const { payload } = await jwtVerify(idToken, jwks, {
        issuer: providerConfig.validIssuers,
        audience,
      })

      return { provider: providerConfig.provider, payload }
    } catch (error) {
      this.logger.error(`Token verification failed: ${error}`)
      throw new UnauthorizedException("Invalid token signature or claims")
    }
  }

  private getJwksClient(config: ProviderConfig): JWKGetter {
    if (this.jwksClientMap.has(config.issuer)) {
      return this.jwksClientMap.get(config.issuer)!
    }

    const newClient = createRemoteJWKSet(new URL(config.jwksUrl), {
      cacheMaxAge: 600000,
      cooldownDuration: 30000,
    })

    this.jwksClientMap.set(config.issuer, newClient)
    return newClient
  }

  private resolveProvider(iss: string): ProviderConfig | null {
    return PROVIDERS.find((p) => p.validIssuers.includes(iss)) ?? null
  }
}
