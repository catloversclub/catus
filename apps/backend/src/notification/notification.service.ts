import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { PrismaService } from "@app/prisma/prisma.service"
import type { PushPlatform } from "@prisma/client"
import Expo from "expo-server-sdk"

@Injectable()
export class NotificationService {
  private readonly expo = new Expo()
  
  constructor(private readonly prisma: PrismaService) {}

  registerPushToken(userId: string, token: string, platform: PushPlatform) {
    if (!Expo.isExpoPushToken(token)) {
      throw new BadRequestException("Invalid Expo push token")
    }
    
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

  async setPushTokenEnabled(userId: string, token: string, enabled: boolean) {
    const updated = await this.prisma.pushToken.updateMany({
      where: {
        token,
        userId,
      },
      data: {
        enabled,
      },
    })

    if (updated.count === 0) {
      throw new NotFoundException("Push token not found")
    }

    return {
      token,
      enabled,
    }
  }

  async sendDevTestNotificationToAllTokens() {
    const pushTokens = await this.prisma.pushToken.findMany({
      where: {
        enabled: true,
      },
      select: {
        token: true,
      },
    })

    const messages = pushTokens
      .filter(({ token }) => Expo.isExpoPushToken(token))
      .map(({ token }) => ({
        to: token,
        sound: "default" as const,
        title: "개발 테스트 알림",
        body: "Expo Push Service 테스트 알림입니다.",
        data: {
          type: "DEV_TEST_NOTIFICATION",
        },
      }))

    const chunks = this.expo.chunkPushNotifications(messages)

    const tickets = []

    for (const chunk of chunks) {
      const result = await this.expo.sendPushNotificationsAsync(chunk)
      tickets.push(...result)
    }

    return {
      tokenCount: pushTokens.length,
      validTokenCount: messages.length,
      tickets,
    }
  }
}
