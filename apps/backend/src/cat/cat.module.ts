import { Module } from "@nestjs/common"
import { CatService } from "./cat.service"
import { CatController, UserCatController } from "./cat.controller"
import { StorageModule } from "@app/storage/storage.module"
import { AuthModule } from "@app/auth/auth.module"

@Module({
  imports: [StorageModule, AuthModule],
  controllers: [CatController, UserCatController],
  providers: [CatService],
})
export class CatModule {}
