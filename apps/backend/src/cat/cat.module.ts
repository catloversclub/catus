import { Module } from "@nestjs/common"
import { CatService } from "./cat.service"
import { CatController } from "./cat.controller"
import { StorageModule } from "@app/storage/storage.module"

@Module({
  imports: [StorageModule],
  controllers: [CatController],
  providers: [CatService],
})
export class CatModule {}
