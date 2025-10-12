import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common"
import { KakaoJwtVerifier } from "@auth/kakao-jwt.verifier"
import { PrismaService } from "@app/prisma/prisma.service"

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly verifier: KakaoJwtVerifier,
    private readonly prisma: PrismaService,
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
    const user = await this.prisma.user.findUnique({
      where: { kakaoId },
      select: { id: true },
    })

    if (!user) throw new ForbiddenException("Onboarding required")

    req.user = { id: user.id }
    return true
  }
}
