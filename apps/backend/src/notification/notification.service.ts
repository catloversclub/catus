import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { PrismaService } from "@app/prisma/prisma.service"
import type { PushPlatform } from "@prisma/client"
import Expo, { type ExpoPushMessage, type ExpoPushTicket } from "expo-server-sdk"

type PushNotificationPayload = Omit<ExpoPushMessage, "to">

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

  async getPushToken(userId: string, token: string) {
    const pushToken = await this.prisma.pushToken.findFirst({
      where: {
        token,
        userId,
      },
      select: {
        token: true,
        platform: true,
        enabled: true,
        lastUsedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!pushToken) {
      throw new NotFoundException("Push token not found")
    }

    return pushToken
  }

  async updatePushToken(userId: string, token: string, enabled: boolean) {
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

  async sendPushNotificationToUser(userId: string, message: PushNotificationPayload) {
    return this.sendPushNotificationToUsers([userId], message)
  }

  async sendPushNotificationToUsers(userIds: string[], message: PushNotificationPayload) {
    const normalizedUserIds = [...new Set(userIds.filter(Boolean))]

    if (normalizedUserIds.length === 0) {
      return {
        tokenCount: 0,
        validTokenCount: 0,
        tickets: [],
      }
    }

    const pushTokens = await this.prisma.pushToken.findMany({
      where: {
        userId: {
          in: normalizedUserIds,
        },
        enabled: true,
      },
      select: {
        token: true,
      },
    })

    return this.sendPushNotificationToTokens(
      pushTokens.map(({ token }) => token),
      message,
    )
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

    return this.sendPushNotificationToTokens(
      pushTokens.map(({ token }) => token),
      {
        sound: "default",
        title: "개발 테스트 알림",
        body: "Expo Push Service 테스트 알림입니다.",
        data: {
          type: "DEV_TEST_NOTIFICATION",
        },
      },
    )
  }

  private async sendPushNotificationToTokens(
    tokens: string[],
    message: PushNotificationPayload,
  ) {
    const normalizedTokens = [...new Set(tokens)]
    const messages = normalizedTokens
      .filter((token) => Expo.isExpoPushToken(token))
      .map(
        (token): ExpoPushMessage => ({
          sound: "default",
          ...message,
          to: token,
        }),
      )

    if (messages.length === 0) {
      return {
        tokenCount: normalizedTokens.length,
        validTokenCount: 0,
        tickets: [],
      }
    }

    const chunks = this.expo.chunkPushNotifications(messages)
    const tickets: ExpoPushTicket[] = []

    for (const chunk of chunks) {
      const result = await this.expo.sendPushNotificationsAsync(chunk)
      tickets.push(...result)
    }

    return {
      tokenCount: normalizedTokens.length,
      validTokenCount: messages.length,
      tickets,
    }
  }
}
