import { PrismaService } from "@app/prisma/prisma.service"
import { Injectable } from "@nestjs/common"

@Injectable()
export class AttributeService {
  constructor(private readonly prisma: PrismaService) {}

  getAppearance() {
    return this.prisma.appearance.findMany()
  }

  getPersonality() {
    return this.prisma.personality.findMany()
  }
}
