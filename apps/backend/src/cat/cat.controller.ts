import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from "@nestjs/common"
import { CatService } from "./cat.service"
import { CreateCatDto } from "./dto/create-cat.dto"
import { UpdateCatDto } from "./dto/update-cat.dto"
import { JwtAuthGuard } from "@app/auth/guards/jwt-auth.guard"
import type { AuthenticatedRequest } from "@app/auth/authenticated-request.interface"

@Controller("cat")
@UseGuards(JwtAuthGuard)
export class CatController {
  constructor(private readonly catService: CatService) {}

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() createCatDto: CreateCatDto) {
    return this.catService.create(req.user.id!, createCatDto)
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.catService.findOne(id)
  }

  @Patch(":id")
  update(
    @Req() req: AuthenticatedRequest,
    @Param("id") id: string,
    @Body() updateCatDto: UpdateCatDto,
  ) {
    return this.catService.update(id, req.user.id!, updateCatDto)
  }

  @Delete(":id")
  delete(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.catService.delete(id, req.user.id!)
  }

  @Post(":id/image/upload-url")
  getProfileImageUploadUrl(
    @Req() req: AuthenticatedRequest,
    @Param("id") id: string,
    @Body("contentType") contentType?: string,
  ) {
    return this.catService.getProfileImageUploadUrl(id, req.user.id!, contentType)
  }
}
