import { Module } from "@nestjs/common"
import { CommentController, PostCommentController } from "./comment.controller"
import { CommentService } from "./comment.service"
import { PrismaModule } from "@app/prisma/prisma.module"
import { AuthModule } from "@app/auth/auth.module"
import { NotificationModule } from "@app/notification/notification.module"

@Module({
  imports: [PrismaModule, AuthModule, NotificationModule],
  controllers: [CommentController, PostCommentController],
  providers: [CommentService],
})
export class CommentModule {}
