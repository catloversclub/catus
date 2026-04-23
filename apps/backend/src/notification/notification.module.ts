import { Module } from "@nestjs/common"
import { AuthModule } from "@app/auth/auth.module"
import { PrismaModule } from "@app/prisma/prisma.module"
import { NotificationService } from "./notification.service"
import { NotificationController } from "./notification.controller"

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}
