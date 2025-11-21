import { Controller, Get } from "@nestjs/common"
import { AttributeService } from "./attribute.service"

@Controller("attribute")
export class AttributeController {
  constructor(private readonly attributeService: AttributeService) {}

  @Get("appearance")
  getAppearance() {
    return this.attributeService.getAppearance()
  }

  @Get("personality")
  getPersonality() {
    return this.attributeService.getPersonality()
  }
}
