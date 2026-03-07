import { Transform } from "class-transformer"
import { IsEnum, IsNotEmpty, IsString } from "class-validator"

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
}