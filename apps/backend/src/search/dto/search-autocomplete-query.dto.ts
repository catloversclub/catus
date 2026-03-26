import { Transform } from "class-transformer"
import { IsNotEmpty, IsString, Matches } from "class-validator"

export class SearchAutocompleteQueryDto {
  @Transform(({ value }) => (typeof value === "string" ? value : value))
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/)
  query!: string
}
