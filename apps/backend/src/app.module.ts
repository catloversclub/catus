import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { PrismaModule } from "./prisma/prisma.module"
import { AuthModule } from "./auth/auth.module"
import { UserModule } from "./user/user.module"
import { CatModule } from "./cat/cat.module"
import { StorageModule } from "./storage/storage.module"
import { APP_FILTER } from "@nestjs/core"
import { PrismaExceptionFilter } from "./common/filters/prisma-exception.filter"
import { PostModule } from "./post/post.module"

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    StorageModule,
    UserModule,
    CatModule,
    PostModule,
  ],
  providers: [{ provide: APP_FILTER, useClass: PrismaExceptionFilter }],
})
export class AppModule {}
