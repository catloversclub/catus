import { PushPlatform } from "@prisma/client"
import { IsEnum, IsNotEmpty, IsString } from "class-validator"

export class RegisterPushTokenDto {
  @IsString()
  @IsNotEmpty()
  token!: string

  @IsEnum(PushPlatform)
  platform!: PushPlatform
}
