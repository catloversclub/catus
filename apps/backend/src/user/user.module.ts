import { Module } from "@nestjs/common"
import { UserService } from "./user.service"
import { UserController } from "./user.controller"
import { StorageModule } from "@app/storage/storage.module"
import { AuthModule } from "@app/auth/auth.module"

@Module({
  imports: [StorageModule, AuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
