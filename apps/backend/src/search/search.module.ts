import { Module } from "@nestjs/common"
import { PrismaModule } from "@app/prisma/prisma.module"
import { AuthModule } from "@app/auth/auth.module"
import { SearchController } from "./search.controller"
import { SearchService } from "./search.service"

@Module({
	imports: [PrismaModule, AuthModule],
	controllers: [SearchController],
	providers: [SearchService],
})
export class SearchModule {}
