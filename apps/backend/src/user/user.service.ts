import { BadRequestException, Injectable } from "@nestjs/common"
import { getImageExtension } from "@app/storage/image-types.const"
import { ConfigService } from "@nestjs/config"
import type { CreateUserDto } from "./dto/create-user.dto"
import type { UpdateUserDto } from "./dto/update-user.dto"
import { PrismaService } from "@app/prisma/prisma.service"
import type { StorageService } from "@app/storage/storage.service"

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
    return this.prisma.user.findUnique({
      where: { id: userId },
    })
  }

  getOne(userId: string) {
    return this.prisma.user.findUnique({
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

  getProfileImageUploadUrl(userId: string, contentType?: string) {
    if (!contentType) {
      throw new BadRequestException("contentType is required")
    }
    const ext = getImageExtension(contentType)
    if (!ext) {
      throw new BadRequestException("Only image content types are allowed: jpeg, png, webp, avif")
    }
    const unique = Date.now().toString(36)
    const objectKey = `users/${userId}/profile/${unique}.${ext}`
    const bucket = this.config.get<string>("S3_BUCKET") ?? "media"
    return this.storage
      .getPresignedUploadUrl(bucket, objectKey, {
        contentType,
        expiresInSeconds: 60 * 2,
      })
      .then((url) => ({ url, key: objectKey }))
  }
}
