import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
} from "class-validator"
import { Type } from "class-transformer"

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  nickname?: string

  @IsBoolean()
  @IsOptional()
  isLivingWithCat?: boolean

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
