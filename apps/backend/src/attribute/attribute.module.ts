import { Module } from "@nestjs/common"
import { AttributeController } from "./attribute.controller"
import { AttributeService } from "./attribute.service"

@Module({
  controllers: [AttributeController],
  providers: [AttributeService],
})
export class AttributeModule {}
