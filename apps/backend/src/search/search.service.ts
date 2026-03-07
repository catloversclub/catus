import { Injectable } from "@nestjs/common"
import { PrismaService } from "@app/prisma/prisma.service"
import { SearchQueryDto, SearchTypeDto } from "./dto/search-query.dto"

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  search(searchQueryDto: SearchQueryDto) {
    const keyword = searchQueryDto.query.trim()

    if (searchQueryDto.type === SearchTypeDto.POST) {
      return this.searchPosts(keyword)
    }

    return this.searchProfiles(keyword)
  }

  private searchPosts(keyword: string) {
    return this.prisma.post.findMany({
      where: {
        content: {
          startsWith: keyword,
          mode: "insensitive",
        },
      },
      orderBy: { id: "desc" },
      include: {
        cat: true,
        author: {
          select: {
            id: true,
            nickname: true,
            profileImageUrl: true,
          },
        },
        images: true,
      },
    }).then((posts) => ({
      type: SearchTypeDto.POST,
      posts,
    }))
  }

  private async searchProfiles(keyword: string) {
    const [users, cats] = await Promise.all([
      this.prisma.user.findMany({
        where: {
          nickname: {
            startsWith: keyword,
            mode: "insensitive",
          },
        },
        orderBy: { nickname: "asc" },
        select: {
          id: true,
          nickname: true,
          profileImageUrl: true,
          followerCount: true,
          followingCount: true,
        },
      }),
      this.prisma.cat.findMany({
        where: {
          OR: [
            {
              name: {
                startsWith: keyword,
                mode: "insensitive",
              },
            },
            {
              breed: {
                startsWith: keyword,
                mode: "insensitive",
              },
            },
          ],
        },
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          breed: true,
          profileImageUrl: true,
          butler: {
            select: {
              id: true,
              nickname: true,
              profileImageUrl: true,
            },
          },
        },
      }),
    ])

    return {
      type: SearchTypeDto.PROFILE,
      users,
      cats,
    }
  }
}