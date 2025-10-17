import { BadRequestException, Injectable } from "@nestjs/common"
import { getImageExtension } from "@app/storage/image-types.const"
import { ConfigService } from "@nestjs/config"
import type { CreateUserDto } from "./dto/create-user.dto"
import type { UpdateUserDto } from "./dto/update-user.dto"
import { PrismaService } from "@app/prisma/prisma.service"
import { StorageService } from "@app/storage/storage.service"
import { uuidv7 } from "uuidv7"

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly config: ConfigService,
  ) {}

  create(createUserDto: CreateUserDto, kakaoId: string) {
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        kakaoId,
      },
    })
  }

  getMe(userId: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    })
  }

  getOne(userId: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        nickname: true,
        profileImageUrl: true,
      },
    })
  }

  update(userId: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({ where: { id: userId }, data: updateUserDto })
  }

  remove(userId: string) {
    return this.prisma.user.delete({ where: { id: userId } })
  }

  async getProfileImageUploadUrl(userId: string, contentType?: string) {
    if (!contentType) {
      throw new BadRequestException("contentType is required")
    }
    const ext = getImageExtension(contentType)
    if (!ext) {
      throw new BadRequestException("Only image content types are allowed: jpeg, png, webp, avif")
    }
    const unique = uuidv7()
    const objectKey = `users/${userId}/profile/${unique}.${ext}`
    const bucket = this.config.get<string>("S3_BUCKET") ?? "catus-media"

    const { url, fields } = await this.storage.getPresignedUploadUrl(bucket, objectKey, {
      contentType,
      expiresInSeconds: 60 * 2,
      maxSizeBytes: 5 * 1024 * 1024,
    })

    return { url, fields }
  }
}
