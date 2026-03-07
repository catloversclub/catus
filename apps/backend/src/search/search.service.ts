import { Injectable } from "@nestjs/common"
import { PrismaService } from "@app/prisma/prisma.service"
import { SearchQueryDto, SearchTypeDto } from "./dto/search-query.dto"

@Injectable()
export class SearchService {
  private static readonly DEFAULT_TAKE = 20

  constructor(private readonly prisma: PrismaService) {}

  search(searchQueryDto: SearchQueryDto) {
    const keyword = searchQueryDto.query.trim()
    const take = searchQueryDto.take ?? SearchService.DEFAULT_TAKE

    if (searchQueryDto.type === SearchTypeDto.POST) {
      return this.searchPosts(keyword, searchQueryDto.cursor ?? null, take)
    }

    return this.searchProfiles(
      keyword,
      searchQueryDto.userCursor ?? null,
      searchQueryDto.catCursor ?? null,
      take,
    )
  }

  private searchPosts(keyword: string, cursor?: string | null, take = SearchService.DEFAULT_TAKE) {
    const pagination = this.prisma.getPaginator(cursor ?? null)

    return this.prisma.post
      .findMany({
        ...pagination,
        take,
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
      })
      .then((posts) => ({
        type: SearchTypeDto.POST,
        posts,
      }))
  }

  private async searchProfiles(
    keyword: string,
    userCursor?: string | null,
    catCursor?: string | null,
    take = SearchService.DEFAULT_TAKE,
  ) {
    const userPagination = this.prisma.getPaginator(userCursor ?? null)
    const catPagination = this.prisma.getPaginator(catCursor ?? null)

    const [users, cats] = await Promise.all([
      this.prisma.user.findMany({
        ...userPagination,
        take,
        where: {
          nickname: {
            startsWith: keyword,
            mode: "insensitive",
          },
        },
        orderBy: { id: "desc" },
        select: {
          id: true,
          nickname: true,
          profileImageUrl: true,
          followerCount: true,
          followingCount: true,
        },
      }),
      this.prisma.cat.findMany({
        ...catPagination,
        take,
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
        orderBy: { id: "desc" },
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
