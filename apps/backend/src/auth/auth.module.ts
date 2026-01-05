import { Module } from "@nestjs/common"
import { JwtAuthGuard } from "./guards/jwt-auth.guard"
import { OidcJwtVerifier } from "./oidc-jwt.verifier"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { AppJwtService } from "./app-jwt.service"

@Module({
  controllers: [AuthController],
  providers: [OidcJwtVerifier, AppJwtService, AuthService, JwtAuthGuard],
  exports: [OidcJwtVerifier, AppJwtService, JwtAuthGuard],
})
export class AuthModule {}
