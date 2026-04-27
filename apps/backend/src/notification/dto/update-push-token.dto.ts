import { IsBoolean } from "class-validator"

export class UpdatePushTokenDto {
  @IsBoolean()
  enabled!: boolean
}
