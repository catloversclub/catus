import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common"
import { PrismaService } from "@app/prisma/prisma.service"
import { OidcJwtVerifier } from "@auth/oidc-jwt.verifier"
import { AppJwtService } from "@auth/app-jwt.service"
import { Provider } from "@prisma/client"
import { createHash, timingSafeEqual } from "crypto"
import { uuidv7 } from "uuidv7"

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex")
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly oidc: OidcJwtVerifier,
    private readonly jwt: AppJwtService,
  ) {}

  private get refreshTokenDelegate() {
    return (this.prisma as any).refreshToken as {
      create: (args: any) => any
      findUnique: (args: any) => any
      update: (args: any) => any
    }
  }

  /**
   * Exchange an OIDC id_token for app-issued access/refresh tokens.
   * - If user does not exist yet (onboarding not done), returns only accessToken (userId=null).
   */
  async exchangeOidcIdToken(idToken: string, providerHint?: string) {
    const { provider, payload } = await this.oidc.verifyIdToken(idToken)

    if (providerHint) {
      const normalized = providerHint.toUpperCase()
      if (normalized !== provider) {
        throw new BadRequestException("provider does not match token")
      }
    }

    const providerId = String(payload.sub ?? "")
    if (!providerId) throw new UnauthorizedException("Invalid token")

    const identity = await this.prisma.userIdentity.findUnique({
      where: {
        provider_id: {
          provider,
          id: providerId,
        },
      },
      select: { userId: true },
    })

    // TODO: Remove legacy kakaoId fallback once all clients migrate to UserIdentity.
    const legacyKakaoUser =
      !identity && provider === Provider.KAKAO
        ? await this.prisma.user.findUnique({
            where: { kakaoId: providerId },
            select: { id: true },
          })
        : null

    const userId = identity?.userId ?? legacyKakaoUser?.id ?? null

    if (legacyKakaoUser && !identity) {
      await this.prisma.userIdentity.upsert({
        where: {
          provider_id: {
            provider: Provider.KAKAO,
            id: providerId,
          },
        },
        update: {},
        create: {
          provider: Provider.KAKAO,
          id: providerId,
          userId: legacyKakaoUser.id,
        },
      })
    }

    const accessToken = await this.jwt.signAccessToken(userId, {
      provider,
      id: providerId,
    })

    if (!userId) {
      return {
        onboardingRequired: true,
        accessToken,
        refreshToken: null as string | null,
      }
    }

    const sessionId = uuidv7()
    const refreshToken = await this.jwt.signRefreshToken(userId, sessionId)

    await this.refreshTokenDelegate.create({
      data: {
        id: sessionId,
        userId,
        tokenHash: hashToken(refreshToken),
        expiresAt: this.jwt.getRefreshExpiryDate(),
      },
    })

    return {
      onboardingRequired: false,
      accessToken,
      refreshToken,
    }
  }

  async refresh(refreshToken: string) {
    const { sid, sub } = await this.jwt.verifyRefreshToken(refreshToken)

    const existing = await this.refreshTokenDelegate.findUnique({
      where: { id: sid },
      select: { id: true, tokenHash: true, revokedAt: true, expiresAt: true, userId: true },
    })

    if (!existing || existing.userId !== sub) {
      throw new UnauthorizedException("Invalid refresh token")
    }

    if (existing.revokedAt) {
      throw new UnauthorizedException("Refresh token revoked")
    }

    if (existing.expiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException("Refresh token expired")
    }

    const incomingHash = hashToken(refreshToken)
    const a = Buffer.from(existing.tokenHash)
    const b = Buffer.from(incomingHash)
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      throw new UnauthorizedException("Invalid refresh token")
    }

    const identity = await this.prisma.userIdentity.findFirst({
      where: { userId: sub },
      orderBy: { createdAt: "asc" },
      select: { provider: true, id: true },
    })

    if (!identity) {
      throw new ForbiddenException("No identity bound to user")
    }

    const accessToken = await this.jwt.signAccessToken(sub, {
      provider: identity.provider,
      id: identity.id,
    })

    // rotate refresh token
    const newSessionId = uuidv7()
    const newRefreshToken = await this.jwt.signRefreshToken(sub, newSessionId)

    await this.prisma.$transaction([
      this.refreshTokenDelegate.update({
        where: { id: sid },
        data: { revokedAt: new Date() },
      }),
      this.refreshTokenDelegate.create({
        data: {
          id: newSessionId,
          userId: sub,
          tokenHash: hashToken(newRefreshToken),
          expiresAt: this.jwt.getRefreshExpiryDate(),
        },
      }),
    ])

    return {
      accessToken,
      refreshToken: newRefreshToken,
    }
  }

  async logout(refreshToken: string) {
    const { sid } = await this.jwt.verifyRefreshToken(refreshToken)

    await this.refreshTokenDelegate.update({
      where: { id: sid },
      data: { revokedAt: new Date() },
    })

    return { ok: true }
  }
}
