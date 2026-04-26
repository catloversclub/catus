import { IsBoolean, IsNotEmpty, IsString } from "class-validator"

export class SetPushTokenEnabledDto {
  @IsString()
  @IsNotEmpty()
  token!: string

  @IsBoolean()
  enabled!: boolean
}
