import { Transform, Type } from "class-transformer"
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator"

export enum SearchTypeDto {
  POST = "post",
  PROFILE = "profile",
}

export class SearchQueryDto {
  @IsEnum(SearchTypeDto)
  type!: SearchTypeDto

  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  query!: string

  @IsString()
  @IsOptional()
  cursor?: string

  @IsString()
  @IsOptional()
  userCursor?: string

  @IsString()
  @IsOptional()
  catCursor?: string

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  take?: number
}
