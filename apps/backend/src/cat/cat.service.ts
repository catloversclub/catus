import { ForbiddenException, Injectable } from "@nestjs/common"
import { CreateCatDto } from "./dto/create-cat.dto"
import { UpdateCatDto } from "./dto/update-cat.dto"
import { PrismaService } from "@app/prisma/prisma.service"

@Injectable()
export class CatService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, createCatDto: CreateCatDto) {
    return this.prisma.cat.create({
      data: {
        ...createCatDto,
        butlerId: userId,
      },
    })
  }

  findOne(id: string) {
    return this.prisma.cat.findUnique({ where: { id } })
  }

  async update(id: string, userId: string, updateCatDto: UpdateCatDto) {
    await this.isMyCat(id, userId)
    return this.prisma.cat.update({ where: { id }, data: updateCatDto })
  }

  async delete(id: string, userId: string) {
    await this.isMyCat(id, userId)
    return this.prisma.cat.delete({ where: { id } })
  }

  private async isMyCat(catId: string, userId: string) {
    const cat = await this.prisma.cat.findUnique({
      where: { id: catId },
      select: { butlerId: true },
    })

    if (cat?.butlerId !== userId) {
      throw new ForbiddenException("She's not your cat")
    }
  }
}
