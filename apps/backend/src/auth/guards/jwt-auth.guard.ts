import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { KakaoJwtVerifier } from "@auth/kakao-jwt.verifier"
import { PrismaService } from "@app/prisma/prisma.service"

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly verifier: KakaoJwtVerifier,
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest()
    const auth = req.headers["authorization"] as string | undefined
    const token = auth?.startsWith("Bearer ") ? auth.slice(7) : undefined
    if (!token) throw new UnauthorizedException("Missing Authorization Token")

    const payload = await this.verifier.verifyIdToken(token).catch(() => {
      throw new UnauthorizedException("Missing Authorization Token")
    })

    const kakaoId = String(payload.sub)

    const onboardingBypass = this.reflector.getAllAndOverride<boolean>("onboarding_bypass", [
      ctx.getHandler(),
      ctx.getClass(),
    ])
    const user = await this.prisma.user.findUnique({
      where: { kakaoId },
      select: { id: true },
    })

    if (!user) {
      if (onboardingBypass) {
        req.user = { id: null, kakaoId }
        return true
      }
      throw new ForbiddenException("Onboarding required")
    }

    req.user = { id: user.id, kakaoId }
    return true
  }
}
