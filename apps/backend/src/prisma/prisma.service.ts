import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common"
import { PrismaClient } from "@prisma/client"

export type Paginator<T> = {
  skip?: number
  cursor?: { id: T }
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect()
  }

  async enableShutdownHooks(app: INestApplication) {
    ;(this as any).$on("beforeExit", async () => {
      await app.close()
    })
  }

  getPaginator<T>(cursor: T | null): Paginator<T> {
    if (cursor == null) {
      return {}
    }
    return {
      skip: 1,
      cursor: { id: cursor },
    }
  }
}
