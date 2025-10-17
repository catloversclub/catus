import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common"
import { getImageExtension } from "@app/storage/image-types.const"
import { ConfigService } from "@nestjs/config"
import { CreateCatDto } from "./dto/create-cat.dto"
import { UpdateCatDto } from "./dto/update-cat.dto"
import { PrismaService } from "@app/prisma/prisma.service"
import { StorageService } from "@app/storage/storage.service"
import { uuidv7 } from "uuidv7"

@Injectable()
export class CatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly config: ConfigService,
  ) {}

  create(userId: string, createCatDto: CreateCatDto) {
    return this.prisma.cat.create({
      data: {
        ...createCatDto,
        butlerId: userId,
      },
    })
  }

  findOne(id: string) {
    return this.prisma.cat.findUniqueOrThrow({ where: { id } })
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

  async getProfileImageUploadUrl(catId: string, userId: string, contentType?: string) {
    await this.isMyCat(catId, userId)
    if (!contentType) {
      throw new BadRequestException("contentType is required")
    }
    const ext = getImageExtension(contentType)
    if (!ext) {
      throw new BadRequestException("Only image content types are allowed: jpeg, png, webp, avif")
    }
    const unique = uuidv7()
    const objectKey = `cats/${catId}/profile/${unique}.${ext}`
    const bucket = this.config.get<string>("S3_BUCKET") ?? "catus-media"

    const { url, fields } = await this.storage.getPresignedUploadUrl(bucket, objectKey, {
      contentType,
      expiresInSeconds: 60 * 2,
      maxSizeBytes: 5 * 1024 * 1024,
    })

    return { url, fields, key: objectKey }
  }
}
