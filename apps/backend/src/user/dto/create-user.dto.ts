import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from "class-validator"
import { Type } from "class-transformer"

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  nickname!: string

  @IsBoolean()
  @IsOptional()
  hasAgreedToTerms?: boolean

  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  @IsOptional()
  @ArrayMaxSize(2)
  favoritePersonality?: number[]

  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  @IsOptional()
  @ArrayMaxSize(2)
  favoriteAppearance?: number[]

  @IsEmail()
  @IsOptional()
  email?: string | null

  @IsString()
  @IsOptional()
  phone?: string | null

  @IsUrl()
  @IsOptional()
  profileImageUrl?: string | null
}
