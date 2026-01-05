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
  Query,
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
    return this.userService.create(createUserDto, req.user.identity)
  }

  @Get("/check-nickname")
  @OnboardingBypass()
  checkNickname(@Query("nickname") nickname: string) {
    return this.userService.checkNickname(nickname)
  }

  @Get("/me")
  getMe(@Req() req: AuthenticatedRequest) {
    return this.userService.getMe(req.user.id!)
  }

  @Get(":id")
  getOne(@Param("id") id: string) {
    return this.userService.getOne(id)
  }

  @Post(":id/follow")
  follow(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.userService.follow(req.user.id!, id)
  }

  @Delete(":id/follow")
  unfollow(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.userService.unfollow(req.user.id!, id)
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
