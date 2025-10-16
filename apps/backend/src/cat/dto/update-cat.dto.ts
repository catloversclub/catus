import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
} from "class-validator"
import { GenderDto } from "./create-cat.dto"
import { Type } from "class-transformer"

export class UpdateCatDto {
  @IsString()
  @IsOptional()
  name?: string

  @IsEnum(GenderDto)
  @IsOptional()
  gender?: GenderDto

  @IsUrl()
  @IsOptional()
  profileImageUrl?: string | null

  @IsDateString()
  @IsOptional()
  birthDate?: string | null

  @IsString()
  @IsOptional()
  breed?: string | null

  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  @IsOptional()
  @ArrayMaxSize(2)
  personality?: number[]

  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  @IsOptional()
  @ArrayMaxSize(2)
  appearance?: number[]
}
