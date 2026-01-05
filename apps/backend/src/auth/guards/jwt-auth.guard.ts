import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { OidcJwtVerifier } from "@auth/oidc-jwt.verifier"
import { PrismaService } from "@app/prisma/prisma.service"
import { Provider } from "@prisma/client"

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly verifier: OidcJwtVerifier,
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest()
    const auth = req.headers["authorization"] as string | undefined
    const token = auth?.startsWith("Bearer ") ? auth.slice(7) : undefined
    if (!token) throw new UnauthorizedException("Missing Authorization Token")

    const { provider, payload } = await this.verifier.verifyIdToken(token).catch(() => {
      throw new UnauthorizedException("Invalid Authorization Token")
    })

    const providerId = String(payload.sub ?? "")
    if (!providerId) {
      throw new UnauthorizedException("Invalid Authorization Token")
    }

    const onboardingBypass = this.reflector.getAllAndOverride<boolean>("onboarding_bypass", [
      ctx.getHandler(),
      ctx.getClass(),
    ])
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

    if (!userId) {
      if (onboardingBypass) {
        req.user = {
          id: null,
          identity: {
            provider,
            id: providerId,
          },
        }
        return true
      }
      throw new ForbiddenException("Onboarding required")
    }

    req.user = {
      id: userId,
      identity: {
        provider,
        id: providerId,
      },
    }
    return true
  }
}
