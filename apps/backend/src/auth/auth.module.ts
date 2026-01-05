import { Module } from "@nestjs/common"
import { JwtAuthGuard } from "./guards/jwt-auth.guard"
import { OidcJwtVerifier } from "./oidc-jwt.verifier"

@Module({
  providers: [OidcJwtVerifier, JwtAuthGuard],
  exports: [OidcJwtVerifier, JwtAuthGuard],
})
export class AuthModule {}
