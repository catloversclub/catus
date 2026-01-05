import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class OidcExchangeDto {
  @IsString()
  @IsNotEmpty()
  idToken!: string

  @IsString()
  @IsOptional()
  provider?: string
}
