import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "@app/auth/guards/jwt-auth.guard"
import type { AuthenticatedRequest } from "@app/auth/authenticated-request.interface"
import { RegisterPushTokenDto } from "./dto/register-push-token.dto"
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

  @Post("test")
  sendDevTestPush() {
    return this.notificationService.sendDevTestNotificationToAllTokens()
  }
}
