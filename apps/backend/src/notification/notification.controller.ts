import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "@app/auth/guards/jwt-auth.guard"
import type { AuthenticatedRequest } from "@app/auth/authenticated-request.interface"
import { RegisterPushTokenDto } from "./dto/register-push-token.dto"
import { SetPushTokenEnabledDto } from "./dto/set-push-token-enabled.dto"
import { NotificationService } from "./notification.service"

@Controller("notification")
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post("push-token")
  registerPushToken(
    @Req() req: AuthenticatedRequest,
    @Body() dto: RegisterPushTokenDto,
  ) {
    return this.notificationService.registerPushToken(req.user.id!, dto.token, dto.platform)
  }

  @Get("push-token/:token")
  getPushToken(@Req() req: AuthenticatedRequest, @Param("token") token: string) {
    return this.notificationService.getPushToken(req.user.id!, token)
  }

  @Patch("push-token/enabled")
  setPushTokenEnabled(
    @Req() req: AuthenticatedRequest,
    @Body() dto: SetPushTokenEnabledDto,
  ) {
    return this.notificationService.setPushTokenEnabled(req.user.id!, dto.token, dto.enabled)
  }

  @Post("test")
  sendDevTestPush() {
    return this.notificationService.sendDevTestNotificationToAllTokens()
  }
}
