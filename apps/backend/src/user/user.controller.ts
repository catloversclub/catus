import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Header,
} from "@nestjs/common"
import { UserService } from "./user.service"
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { JwtAuthGuard } from "@app/auth/guards/jwt-auth.guard"
import { OnboardingBypass } from "@app/auth/decorators/onboarding-bypass.decorator"
import type { AuthenticatedRequest } from "@app/auth/authenticated-request.interface"

@Controller("user")
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @OnboardingBypass()
  create(@Req() req: AuthenticatedRequest, @Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto, req.user.kakaoId)
  }

  @Get(":id")
  getOne(@Param("id") id: string) {
    return this.userService.getOne(id)
  }

  @Get("/me")
  getMe(@Req() req: AuthenticatedRequest) {
    return this.userService.getMe(req.user.id!)
  }

  @Patch("/me")
  update(
    @Req() req: AuthenticatedRequest,
    @Body()
    updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(req.user.id!, updateUserDto)
  }

  @Delete("/me")
  remove(@Req() req: AuthenticatedRequest) {
    return this.userService.remove(req.user.id!)
  }

  @Post("/me/image/upload-url")
  getProfileImageUploadUrl(
    @Req() req: AuthenticatedRequest,
    @Body("contentType") contentType?: string,
  ) {
    return this.userService.getProfileImageUploadUrl(req.user.id!, contentType)
  }
}
