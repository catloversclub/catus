import { Module } from "@nestjs/common"
import { KakaoJwtVerifier } from "./kakao-jwt.verifier"
import { JwtAuthGuard } from "./guards/jwt-auth.guard"

@Module({
  providers: [KakaoJwtVerifier, JwtAuthGuard],
  exports: [KakaoJwtVerifier, JwtAuthGuard],
})
export class AuthModule {}
