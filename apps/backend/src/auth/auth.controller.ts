import { Body, Controller, Post } from "@nestjs/common"
import { AuthService } from "@auth/auth.service"
import { OidcExchangeDto } from "@auth/dto/oidc-exchange.dto"
import { RefreshTokenDto } from "@auth/dto/refresh-token.dto"

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  /**
   * Exchange OIDC id_token for app-issued tokens.
   *
   * NOTE: Kakao legacy still supports using id_token directly as Bearer (see JwtAuthGuard TODO).
   */
  @Post("oidc/exchange")
  exchangeOidc(@Body() dto: OidcExchangeDto) {
    return this.auth.exchangeOidcIdToken(dto.idToken, dto.provider)
  }

  @Post("refresh")
  refresh(@Body() dto: RefreshTokenDto) {
    return this.auth.refresh(dto.refreshToken)
  }

  @Post("logout")
  logout(@Body() dto: RefreshTokenDto) {
    return this.auth.logout(dto.refreshToken)
  }
}
