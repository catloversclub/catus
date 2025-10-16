import { Injectable } from "@nestjs/common"
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { PrismaService } from "@app/prisma/prisma.service"

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

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
}
