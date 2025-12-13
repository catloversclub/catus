import { Module } from "@nestjs/common"
import { PostService } from "./post.service"
import { CatPostController, PostController, UserPostController } from "./post.controller"
import { PrismaModule } from "@app/prisma/prisma.module"
import { StorageModule } from "@app/storage/storage.module"
import { AuthModule } from "@app/auth/auth.module"

@Module({
  imports: [PrismaModule, StorageModule, AuthModule],
  controllers: [PostController, UserPostController, CatPostController],
  providers: [PostService],
})
export class PostModule {}
