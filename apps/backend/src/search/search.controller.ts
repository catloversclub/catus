import { JwtAuthGuard } from "@app/auth/guards/jwt-auth.guard"
import { Controller, Get, Query, UseGuards } from "@nestjs/common"
import { SearchService } from "./search.service"
import { SearchQueryDto } from "./dto/search-query.dto"

@Controller("search")
@UseGuards(JwtAuthGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get("")
  search(@Query() query: SearchQueryDto) {
    return this.searchService.search(query)
  }
}
