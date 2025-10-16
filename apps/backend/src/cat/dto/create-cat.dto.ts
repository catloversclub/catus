import { Type } from "class-transformer"
import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from "class-validator"

export enum GenderDto {
  MALE = "MALE",
  FEMALE = "FEMALE",
  UNKNOWN = "UNKNOWN",
}

export class CreateCatDto {
  @IsString()
  @IsNotEmpty()
  name!: string

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
