import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { AuthModule } from "./auth/auth.module"
import { PrismaModule } from "./prisma/prisma.module"
import { UserModule } from "./user/user.module"
import { CatModule } from "./cat/cat.module"

@Module({
  imports: [AuthModule, PrismaModule, UserModule, CatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
