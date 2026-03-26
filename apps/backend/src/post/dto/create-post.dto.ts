import { ArrayMaxSize, IsArray, IsOptional, IsString, IsUrl } from "class-validator"

export class CreatePostDto {
  @IsString()
  @IsOptional()
  content?: string | null

  @IsString()
  @IsOptional()
  catId?: string | null

  @IsArray()
  @ArrayMaxSize(10)
  @IsUrl({}, { each: true })
  @IsOptional()
  imageUrls?: string[] | null
}
