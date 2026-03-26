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

function parseAudiences(raw: string | undefined): string[] | null {
  if (!raw) return null

  const trimmed = raw.trim()
  if (!trimmed) return null

  const audiences = trimmed
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)

  return audiences.length ? audiences : null
}

@Injectable()
export class OidcJwtVerifier {
  private readonly logger = new Logger(OidcJwtVerifier.name)

  private readonly jwksClientMap = new Map<string, JWKGetter>()
  private readonly audiencesByProvider: Partial<Record<Provider, string[]>> = {}

  constructor(private readonly config: ConfigService) {
    for (const p of PROVIDERS) {
      const raw = this.config.get<string>(p.audienceEnv)
      const audiences = parseAudiences(raw)

      if (audiences) {
        this.audiencesByProvider[p.provider] = audiences
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
    } catch {
      throw new UnauthorizedException("Malformed token")
    }

    if (!iss) throw new UnauthorizedException("Token missing issuer")

    const providerConfig = this.resolveProvider(iss)
    if (!providerConfig) {
      throw new UnauthorizedException(`Unsupported token issuer: ${iss}`)
    }

    const audiences = this.audiencesByProvider[providerConfig.provider]
    if (!audiences?.length) {
      throw new InternalServerErrorException(
        `OIDC audience not configured for ${providerConfig.provider}`,
      )
    }

    const jwks = this.getJwksClient(providerConfig)

    try {
      const { payload } = await jwtVerify(idToken, jwks, {
        issuer: providerConfig.validIssuers,
        audience: audiences,
      })

      return { provider: providerConfig.provider, payload }
    } catch (error) {
      this.logger.error(`Token verification failed: ${String(error)}`)
      throw new UnauthorizedException("Invalid token signature or claims")
    }
  }

  private getJwksClient(config: ProviderConfig): JWKGetter {
    const cached = this.jwksClientMap.get(config.issuer)
    if (cached) return cached

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
