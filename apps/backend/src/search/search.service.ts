import { Injectable } from "@nestjs/common"
import { PrismaService } from "@app/prisma/prisma.service"
import { SearchQueryDto, SearchTypeDto } from "./dto/search-query.dto"
import { SearchAutocompleteQueryDto } from "./dto/search-autocomplete-query.dto"

type PostWithViewerLike = {
  likes: Array<{ userId: string }>
}

@Injectable()
export class SearchService {
  private static readonly DEFAULT_TAKE = 20
  private static readonly AUTOCOMPLETE_TAKE = 5

  constructor(private readonly prisma: PrismaService) {}

  search(viewerId: string, searchQueryDto: SearchQueryDto) {
    const keyword = searchQueryDto.query.trim()
    const take = searchQueryDto.take ?? SearchService.DEFAULT_TAKE

    if (searchQueryDto.type === SearchTypeDto.POST) {
      return this.searchPosts(keyword, viewerId, searchQueryDto.cursor ?? null, take)
    }

    return this.searchProfiles(
      keyword,
      searchQueryDto.userCursor ?? null,
      searchQueryDto.catCursor ?? null,
      take,
    )
  }

  private getPostInclude(viewerId: string) {
    return {
      cat: true,
      author: {
        select: {
          id: true,
          nickname: true,
          profileImageUrl: true,
        },
      },
      images: true,
      likes: {
        where: { userId: viewerId },
        select: { userId: true },
      },
    } as const
  }

  private attachLikeState<T extends PostWithViewerLike>(post: T) {
    const { likes, ...rest } = post

    return {
      ...rest,
      isLikedByMe: likes.length > 0,
    }
  }

  async autocomplete(searchAutocompleteQueryDto: SearchAutocompleteQueryDto) {
    const rawKeyword = searchAutocompleteQueryDto.query.trimStart()
    const keyword = rawKeyword.trim()

    const [profileResult, postResult] = await Promise.all([
      this.autocompleteProfiles(keyword),
      this.autocompletePosts(rawKeyword),
    ])

    return {
      profile: profileResult,
      post: postResult,
    }
  }

  private async autocompleteProfiles(keyword: string) {
    const [users, cats] = await Promise.all([
      this.prisma.user.findMany({
        take: SearchService.AUTOCOMPLETE_TAKE * 5,
        where: {
          nickname: {
            startsWith: keyword,
            mode: "insensitive",
          },
        },
        orderBy: { id: "desc" },
        select: {
          nickname: true,
          profileImageUrl: true,
        },
      }),
      this.prisma.cat.findMany({
        take: SearchService.AUTOCOMPLETE_TAKE * 5,
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
          name: true,
          profileImageUrl: true,
        },
      }),
    ])

    const sortedUsers = users
      .map((user) => ({
        profileName: user.nickname,
        profileImageUrl: user.profileImageUrl,
      }))
      .sort((a, b) => this.compareByLengthThenName(a.profileName, b.profileName))
      .slice(0, SearchService.AUTOCOMPLETE_TAKE)

    const sortedCats = cats
      .map((cat) => ({
        profileName: cat.name,
        profileImageUrl: cat.profileImageUrl,
      }))
      .sort((a, b) => this.compareByLengthThenName(a.profileName, b.profileName))
      .slice(0, SearchService.AUTOCOMPLETE_TAKE)

    return {
      users: sortedUsers,
      cats: sortedCats,
    }
  }

  private async autocompletePosts(rawKeyword: string) {
    const searchKeyword = rawKeyword.trimStart()

    if (!searchKeyword.trim()) {
      return { keywords: [] }
    }

    const posts = await this.prisma.post.findMany({
      take: SearchService.AUTOCOMPLETE_TAKE * 5,
      where: {
        content: {
          startsWith: searchKeyword,
          mode: "insensitive",
        },
      },
      orderBy: { id: "desc" },
      select: {
        content: true,
      },
    })

    const keywords = Array.from(
      new Set(
        posts
          .map((post) => (post.content ?? "").trim())
          .filter(Boolean)
          .map((content) => this.buildAutocompletePostKeyword(content, searchKeyword))
          .filter(Boolean),
      ),
    )
      .sort((a, b) => this.compareByLengthThenName(a, b))
      .slice(0, SearchService.AUTOCOMPLETE_TAKE)

    return {
      keywords,
    }
  }

  private buildAutocompletePostKeyword(content: string, query: string) {
    const contentTokens = content.split(/\s+/).filter(Boolean)
    const queryEndsWithSpace = /\s$/.test(query)
    const queryTokens = query.trim().split(/\s+/).filter(Boolean)

    if (contentTokens.length === 0 || queryTokens.length === 0) {
      return ""
    }

    const typedTokenCount = queryTokens.length
    const currentTokenIndex = typedTokenCount - 1
    const currentQueryToken = queryTokens[currentTokenIndex]?.toLowerCase() ?? ""
    const currentContentToken = contentTokens[currentTokenIndex]?.toLowerCase() ?? ""
    const shouldExpandToNextToken =
      queryEndsWithSpace ||
      (currentQueryToken.length > 0 && currentQueryToken === currentContentToken)

    const tokenCount = Math.min(
      typedTokenCount + (shouldExpandToNextToken ? 1 : 0),
      contentTokens.length,
    )

    return contentTokens.slice(0, tokenCount).join(" ")
  }

  private compareByLengthThenName(a: string, b: string) {
    return a.length - b.length || a.localeCompare(b)
  }

  private searchPosts(
    keyword: string,
    viewerId: string,
    cursor?: string | null,
    take = SearchService.DEFAULT_TAKE,
  ) {
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
          ...this.getPostInclude(viewerId),
        },
      })
      .then((posts) => ({
        type: SearchTypeDto.POST,
        posts: posts.map((post) => this.attachLikeState(post)),
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
