import { Injectable } from "@nestjs/common"
import { PrismaService } from "@app/prisma/prisma.service"
import type { PushPlatform } from "@prisma/client"

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  registerPushToken(userId: string, token: string, platform: PushPlatform) {
    const now = new Date()

    return this.prisma.pushToken.upsert({
      where: {
        token,
      },
      update: {
        userId,
        platform,
        enabled: true,
        lastUsedAt: now,
      },
      create: {
        userId,
        token,
        platform,
        enabled: true,
        lastUsedAt: now,
      },
    })
  }
}
