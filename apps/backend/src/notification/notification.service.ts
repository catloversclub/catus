import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { PrismaService } from "@app/prisma/prisma.service"
import { Prisma, type PushPlatform } from "@prisma/client"
import Expo, { type ExpoPushMessage, type ExpoPushTicket } from "expo-server-sdk"

type PushNotificationPayload = Omit<ExpoPushMessage, "to" | "badge">

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

  async getNotifications(userId: string, cursor?: string | null, take = 20) {
    const readAt = new Date()
    const pagination = this.prisma.getPaginator(cursor ?? null)

    const [notifications] = await this.prisma.$transaction([
      this.prisma.notification.findMany({
        ...pagination,
        take,
        where: {
          userId,
          createdAt: {
            lte: readAt,
          },
        },
        orderBy: {
          id: "desc",
        },
      }),
      this.prisma.notification.updateMany({
        where: {
          userId,
          readAt: null,
          createdAt: {
            lte: readAt,
          },
        },
        data: {
          readAt,
        },
      }),
    ])

    return notifications.map((notification) => ({
      ...notification,
      readAt: notification.readAt ?? readAt,
    }))
  }

  async sendPushNotificationToUser(userId: string, message: PushNotificationPayload) {
    return this.sendPushNotificationToUsers([userId], message)
  }

  async sendPushNotificationToUsers(userIds: string[], message: PushNotificationPayload) {
    const normalizedUserIds = [...new Set(userIds.filter(Boolean))]

    if (normalizedUserIds.length === 0) {
      return {
        notificationCount: 0,
        tokenCount: 0,
        validTokenCount: 0,
        tickets: [],
      }
    }

    const notificationData = message.data
      ? (message.data as Prisma.InputJsonValue)
      : undefined

    await this.prisma.notification.createMany({
      data: normalizedUserIds.map((userId) => ({
        userId,
        title: message.title ?? null,
        body: message.body ?? null,
        data: notificationData,
      })),
    })

    const [pushTokens, unreadCounts] = await Promise.all([
      this.prisma.pushToken.findMany({
        where: {
          userId: {
            in: normalizedUserIds,
          },
          enabled: true,
        },
        select: {
          userId: true,
          token: true,
        },
      }),
      this.prisma.notification.groupBy({
        by: ["userId"],
        where: {
          userId: {
            in: normalizedUserIds,
          },
          readAt: null,
        },
        _count: {
          _all: true,
        },
      }),
    ])

    const unreadCountByUserId = new Map(
      unreadCounts.map((item) => [item.userId, item._count._all]),
    )

    const messages = pushTokens
      .filter(({ token }) => Expo.isExpoPushToken(token))
      .map(
        ({ userId, token }): ExpoPushMessage => ({
          sound: "default",
          ...message,
          badge: unreadCountByUserId.get(userId) ?? 0,
          to: token,
        }),
      )

    const tickets = await this.sendExpoMessages(messages)

    return {
      notificationCount: normalizedUserIds.length,
      tokenCount: pushTokens.length,
      validTokenCount: messages.length,
      tickets,
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
      .map(
        ({ token }): ExpoPushMessage => ({
          to: token,
          sound: "default",
          title: "개발 테스트 알림",
          body: "Expo Push Service 테스트 알림입니다.",
          data: {
            type: "DEV_TEST_NOTIFICATION",
          },
        }),
      )

    const tickets = await this.sendExpoMessages(messages)

    return {
      tokenCount: pushTokens.length,
      validTokenCount: messages.length,
      tickets,
    }
  }

  private async sendExpoMessages(messages: ExpoPushMessage[]) {
    if (messages.length === 0) {
      return []
    }

    const chunks = this.expo.chunkPushNotifications(messages)
    const tickets: ExpoPushTicket[] = []

    for (const chunk of chunks) {
      const result = await this.expo.sendPushNotificationsAsync(chunk)
      tickets.push(...result)
    }

    return tickets
  }
}
