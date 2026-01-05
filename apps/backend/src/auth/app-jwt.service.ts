import { Injectable, UnauthorizedException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import type { Provider } from "@prisma/client"
import type { JWTPayload } from "jose"

type Identity = { provider: Provider; id: string }

type AccessClaims = {
  typ: "access"
  sub: string | null
  identity: Identity
}

type RefreshClaims = {
  typ: "refresh"
  sub: string
  sid: string
}

@Injectable()
export class AppJwtService {
  private readonly accessSecret: Uint8Array
  private readonly refreshSecret: Uint8Array
  private readonly accessTtlSeconds: number
  private readonly refreshTtlSeconds: number

  constructor(private readonly config: ConfigService) {
    const access = this.config.get<string>("JWT_ACCESS_SECRET")
    const refresh = this.config.get<string>("JWT_REFRESH_SECRET")
    if (!access) throw new Error("JWT_ACCESS_SECRET is not configured")
    if (!refresh) throw new Error("JWT_REFRESH_SECRET is not configured")

    this.accessSecret = new TextEncoder().encode(access)
    this.refreshSecret = new TextEncoder().encode(refresh)

    this.accessTtlSeconds = Number(this.config.get<string>("JWT_ACCESS_TTL_SECONDS") ?? 60 * 15)
    this.refreshTtlSeconds = Number(
      this.config.get<string>("JWT_REFRESH_TTL_SECONDS") ?? 60 * 60 * 24 * 30,
    )
  }

  async signAccessToken(userId: string | null, identity: Identity) {
    const { SignJWT } = await import("jose")

    return new SignJWT({ identity, typ: "access" } satisfies Omit<AccessClaims, "sub">)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(Math.floor(Date.now() / 1000) + this.accessTtlSeconds)
      .setSubject(userId ?? "")
      .sign(this.accessSecret)
  }

  async signRefreshToken(userId: string, sessionId: string) {
    const { SignJWT } = await import("jose")

    return new SignJWT({ typ: "refresh", sid: sessionId } satisfies Omit<RefreshClaims, "sub">)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(Math.floor(Date.now() / 1000) + this.refreshTtlSeconds)
      .setSubject(userId)
      .sign(this.refreshSecret)
  }

  async verifyAccessToken(token: string): Promise<AccessClaims & { exp?: number }> {
    const { jwtVerify } = await import("jose")

    try {
      const { payload } = await jwtVerify(token, this.accessSecret)
      const identity = (payload as any).identity
      const typ = (payload as any).typ
      const sub = payload.sub ?? null

      if (typ !== "access" || !identity?.provider || !identity?.id) {
        throw new UnauthorizedException("Invalid token")
      }

      return {
        typ: "access",
        sub: sub && sub.length > 0 ? sub : null,
        identity,
        exp: payload.exp,
      }
    } catch {
      throw new UnauthorizedException("Invalid Authorization Token")
    }
  }

  async verifyRefreshToken(token: string): Promise<RefreshClaims & { exp?: number }> {
    const { jwtVerify } = await import("jose")

    try {
      const { payload } = await jwtVerify(token, this.refreshSecret)
      const typ = (payload as any).typ
      const sid = (payload as any).sid
      const sub = payload.sub

      if (typ !== "refresh" || !sid || !sub) {
        throw new UnauthorizedException("Invalid token")
      }

      return {
        typ: "refresh",
        sid,
        sub,
        exp: payload.exp,
      }
    } catch {
      throw new UnauthorizedException("Invalid Authorization Token")
    }
  }

  getRefreshExpiryDate() {
    return new Date(Date.now() + this.refreshTtlSeconds * 1000)
  }
}
