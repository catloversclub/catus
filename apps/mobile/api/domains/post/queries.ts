import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query"

import {
  bookmarkPost,
  createPost,
  deletePost,
  getCatPosts,
  getFollowingFeed,
  getMyPosts,
  getPostById,
  getPostImageUploadUrl,
  getRecommendedFeed,
  getUserPosts,
  likePost,
  unbookmarkPost,
  unlikePost,
  updatePost,
  uploadPostImage,
} from "./api"
import { CreatePostRequest, Post, UpdatePostRequest } from "./types"
import { POST_PAGINATION } from "@/constants/posts"

export const postKeys = {
  all: ["post"] as const,
  detail: (postId: string) => [...postKeys.all, "detail", postId] as const,
  myPosts: () => [...postKeys.all, "my"] as const,
  userPosts: (userId: string) => [...postKeys.all, "user", userId] as const,
  catPosts: (catId: string) => [...postKeys.all, "cat", catId] as const,
  followingFeed: () => [...postKeys.all, "feed", "following"] as const,
  recommendedFeed: () => [...postKeys.all, "feed", "recommended"] as const,
}

export const usePostByIdQuery = (postId: string) => {
  return useSuspenseQuery({
    queryKey: postKeys.detail(postId),
    queryFn: () => getPostById(postId),
  })
}

export const useMyPostsQuery = () => {
  return useQuery({
    queryKey: postKeys.myPosts(),
    queryFn: getMyPosts,
  })
}

export const useUserPostsQuery = (userId: string) => {
  return useSuspenseQuery({
    queryKey: postKeys.userPosts(userId),
    queryFn: () => getUserPosts(userId),
  })
}

export const useCatPostsQuery = (catId: string) => {
  return useQuery({
    queryKey: postKeys.catPosts(catId),
    queryFn: () => getCatPosts(catId),
    enabled: !!catId,
  })
}

export const useFollowingFeedQuery = () => {
  return useSuspenseInfiniteQuery({
    queryKey: postKeys.followingFeed(),
    // pageParam이 cursor 역할을 합니다.
    queryFn: ({ pageParam }) =>
      getFollowingFeed({ take: POST_PAGINATION.DEFAULT_TAKE, cursor: pageParam }),
    initialPageParam: undefined as string | undefined, // 첫 요청 시 커서는 없음

    getNextPageParam: (lastPage) => {
      // 응답 데이터가 20개 미만이면 더 이상 불러올 데이터가 없다고 판단
      if (!lastPage || lastPage.length < POST_PAGINATION.DEFAULT_TAKE) {
        return undefined
      }

      // 순수 배열(Post[])이므로, 마지막 요소의 id(string)를 다음 커서로 반환
      return lastPage[lastPage.length - 1].id
    },
  })
}

export const useRecommendedFeedQuery = () => {
  return useSuspenseInfiniteQuery({
    queryKey: postKeys.recommendedFeed(),
    // pageParam이 cursor 역할을 합니다.
    queryFn: ({ pageParam }) =>
      getRecommendedFeed({ take: POST_PAGINATION.DEFAULT_TAKE, cursor: pageParam }),
    initialPageParam: undefined as string | undefined, // 첫 요청 시 커서는 없음

    getNextPageParam: (lastPage) => {
      // 응답 데이터가 20개 미만이면 더 이상 불러올 데이터가 없다고 판단
      if (!lastPage || lastPage.length < POST_PAGINATION.DEFAULT_TAKE) {
        return undefined
      }

      // 순수 배열(Post[])이므로, 마지막 요소의 id(string)를 다음 커서로 반환
      return lastPage[lastPage.length - 1].id
    },
  })
}

export const useCreatePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreatePostRequest) => createPost(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.myPosts() })
      queryClient.invalidateQueries({ queryKey: postKeys.followingFeed() })
      queryClient.invalidateQueries({ queryKey: postKeys.recommendedFeed() })
    },
  })
}

export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, payload }: { postId: string; payload: UpdatePostRequest }) =>
      updatePost(postId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.postId) })
      queryClient.invalidateQueries({ queryKey: postKeys.myPosts() })
      queryClient.invalidateQueries({ queryKey: postKeys.followingFeed() })
      queryClient.invalidateQueries({ queryKey: postKeys.recommendedFeed() })
    },
  })
}

export const useDeletePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.myPosts() })
      queryClient.invalidateQueries({ queryKey: postKeys.followingFeed() })
      queryClient.invalidateQueries({ queryKey: postKeys.recommendedFeed() })
    },
  })
}

export const useLikePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    // postId는 UUID이므로 string 타입입니다.
    mutationFn: ({ postId }: { postId: string }) => likePost(postId),

    onMutate: async ({ postId }) => {
      // 1. 진행 중인 쿼리 취소
      await Promise.all([
        queryClient.cancelQueries({ queryKey: postKeys.followingFeed() }),
        queryClient.cancelQueries({ queryKey: postKeys.recommendedFeed() }), // 있다면
        queryClient.cancelQueries({ queryKey: postKeys.detail(postId) }),
      ])

      // 2. 이전 상태 스냅샷 저장 (타입을 InfiniteData<Post[]> 로 명확히 지정)
      const prevFollowing = queryClient.getQueryData<InfiniteData<Post[]>>(postKeys.followingFeed())
      const prevRecommended = queryClient.getQueryData<InfiniteData<Post[]>>(
        postKeys.recommendedFeed(),
      )
      const prevDetail = queryClient.getQueryData<Post>(postKeys.detail(postId))

      // 3. 업데이트 헬퍼 함수: 페이지(Post[])들의 배열을 순회
      const updateFeed = (
        oldData: InfiniteData<Post[]> | undefined,
      ): InfiniteData<Post[]> | undefined => {
        if (!oldData) return undefined
        return {
          ...oldData,
          // page는 객체가 아니라 Post[] (배열) 자체입니다.
          pages: oldData.pages.map((page) =>
            page.map((post) =>
              post.id === postId
                ? { ...post, likedByMe: true, likeCount: post.likeCount + 1 }
                : post,
            ),
          ),
        }
      }

      // 4. 즉각적인 UI 반영
      queryClient.setQueryData<InfiniteData<Post[]>>(postKeys.followingFeed(), updateFeed)
      queryClient.setQueryData<InfiniteData<Post[]>>(postKeys.recommendedFeed(), updateFeed)
      queryClient.setQueryData<Post>(postKeys.detail(postId), (old) =>
        old ? { ...old, likedByMe: true, likeCount: old.likeCount + 1 } : old,
      )

      return { prevFollowing, prevRecommended, prevDetail }
    },

    onError: (err, variables, context) => {
      // 에러 시 롤백
      if (context) {
        queryClient.setQueryData(postKeys.followingFeed(), context.prevFollowing)
        queryClient.setQueryData(postKeys.recommendedFeed(), context.prevRecommended)
        queryClient.setQueryData(postKeys.detail(variables.postId), context.prevDetail)
      }
    },

    onSettled: (data, error, variables) => {
      // 최종 동기화
      queryClient.invalidateQueries({ queryKey: postKeys.followingFeed() })
      queryClient.invalidateQueries({ queryKey: postKeys.recommendedFeed() })
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.postId) })
    },
  })
}

export const useUnlikePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    // postId는 UUID이므로 string 타입
    mutationFn: ({ postId }: { postId: string }) => unlikePost(postId),

    onMutate: async ({ postId }) => {
      // 1. 진행 중인 쿼리 취소
      await Promise.all([
        queryClient.cancelQueries({ queryKey: postKeys.followingFeed() }),
        queryClient.cancelQueries({ queryKey: postKeys.recommendedFeed() }),
        queryClient.cancelQueries({ queryKey: postKeys.detail(postId) }),
      ])

      // 2. 이전 상태 스냅샷 저장
      const prevFollowing = queryClient.getQueryData<InfiniteData<Post[]>>(postKeys.followingFeed())
      const prevRecommended = queryClient.getQueryData<InfiniteData<Post[]>>(
        postKeys.recommendedFeed(),
      )
      const prevDetail = queryClient.getQueryData<Post>(postKeys.detail(postId))

      // 3. 업데이트 헬퍼 함수 (좋아요 취소 로직)
      const updateFeed = (
        oldData: InfiniteData<Post[]> | undefined,
      ): InfiniteData<Post[]> | undefined => {
        if (!oldData) return undefined
        return {
          ...oldData,
          pages: oldData.pages.map((page) =>
            page.map((post) =>
              post.id === postId
                ? { ...post, likedByMe: false, likeCount: Math.max(0, post.likeCount - 1) } // 0 이하 방지
                : post,
            ),
          ),
        }
      }

      // 4. 즉각적인 UI 반영
      queryClient.setQueryData<InfiniteData<Post[]>>(postKeys.followingFeed(), updateFeed)
      queryClient.setQueryData<InfiniteData<Post[]>>(postKeys.recommendedFeed(), updateFeed)
      queryClient.setQueryData<Post>(postKeys.detail(postId), (old) =>
        old ? { ...old, likedByMe: false, likeCount: Math.max(0, old.likeCount - 1) } : old,
      )

      return { prevFollowing, prevRecommended, prevDetail }
    },

    onError: (err, variables, context) => {
      // 에러 시 롤백
      if (context) {
        queryClient.setQueryData(postKeys.followingFeed(), context.prevFollowing)
        queryClient.setQueryData(postKeys.recommendedFeed(), context.prevRecommended)
        queryClient.setQueryData(postKeys.detail(variables.postId), context.prevDetail)
      }
    },

    onSettled: (data, error, variables) => {
      // 최종 동기화
      queryClient.invalidateQueries({ queryKey: postKeys.followingFeed() })
      queryClient.invalidateQueries({ queryKey: postKeys.recommendedFeed() })
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.postId) })
    },
  })
}

export const useBookmarkMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId }: { postId: string }) => bookmarkPost(postId),

    onMutate: async ({ postId }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: postKeys.followingFeed() }),
        queryClient.cancelQueries({ queryKey: postKeys.recommendedFeed() }),
        queryClient.cancelQueries({ queryKey: postKeys.detail(postId) }),
      ])

      const prevFollowing = queryClient.getQueryData<InfiniteData<Post[]>>(postKeys.followingFeed())
      const prevRecommended = queryClient.getQueryData<InfiniteData<Post[]>>(
        postKeys.recommendedFeed(),
      )
      const prevDetail = queryClient.getQueryData<Post>(postKeys.detail(postId))

      const updateFeed = (
        oldData: InfiniteData<Post[]> | undefined,
      ): InfiniteData<Post[]> | undefined => {
        if (!oldData) return undefined
        return {
          ...oldData,
          pages: oldData.pages.map((page) =>
            page.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    isBookmarkedByMe: true,
                  }
                : post,
            ),
          ),
        }
      }

      queryClient.setQueryData<InfiniteData<Post[]>>(postKeys.followingFeed(), updateFeed)
      queryClient.setQueryData<InfiniteData<Post[]>>(postKeys.recommendedFeed(), updateFeed)
      queryClient.setQueryData<Post>(postKeys.detail(postId), (old) =>
        old
          ? {
              ...old,
              isBookmarkedByMe: true,
            }
          : old,
      )

      return { prevFollowing, prevRecommended, prevDetail }
    },

    onError: (err, variables, context) => {
      if (context) {
        queryClient.setQueryData(postKeys.followingFeed(), context.prevFollowing)
        queryClient.setQueryData(postKeys.recommendedFeed(), context.prevRecommended)
        queryClient.setQueryData(postKeys.detail(variables.postId), context.prevDetail)
      }
    },

    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: postKeys.followingFeed() })
      queryClient.invalidateQueries({ queryKey: postKeys.recommendedFeed() })
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.postId) })
    },
  })
}

export const useUnbookmarkMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId }: { postId: string }) => unbookmarkPost(postId),

    onMutate: async ({ postId }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: postKeys.followingFeed() }),
        queryClient.cancelQueries({ queryKey: postKeys.recommendedFeed() }),
        queryClient.cancelQueries({ queryKey: postKeys.detail(postId) }),
      ])

      const prevFollowing = queryClient.getQueryData<InfiniteData<Post[]>>(postKeys.followingFeed())
      const prevRecommended = queryClient.getQueryData<InfiniteData<Post[]>>(
        postKeys.recommendedFeed(),
      )
      const prevDetail = queryClient.getQueryData<Post>(postKeys.detail(postId))

      const updateFeed = (
        oldData: InfiniteData<Post[]> | undefined,
      ): InfiniteData<Post[]> | undefined => {
        if (!oldData) return undefined
        return {
          ...oldData,
          pages: oldData.pages.map((page) =>
            page.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    isBookmarkedByMe: false,
                  }
                : post,
            ),
          ),
        }
      }

      queryClient.setQueryData<InfiniteData<Post[]>>(postKeys.followingFeed(), updateFeed)
      queryClient.setQueryData<InfiniteData<Post[]>>(postKeys.recommendedFeed(), updateFeed)
      queryClient.setQueryData<Post>(postKeys.detail(postId), (old) =>
        old
          ? {
              ...old,
              isBookmarkedByMe: false,
            }
          : old,
      )

      return { prevFollowing, prevRecommended, prevDetail }
    },

    onError: (err, variables, context) => {
      if (context) {
        queryClient.setQueryData(postKeys.followingFeed(), context.prevFollowing)
        queryClient.setQueryData(postKeys.recommendedFeed(), context.prevRecommended)
        queryClient.setQueryData(postKeys.detail(variables.postId), context.prevDetail)
      }
    },

    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: postKeys.followingFeed() })
      queryClient.invalidateQueries({ queryKey: postKeys.recommendedFeed() })
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.postId) })
    },
  })
}

export const usePostImageUploadUrlMutation = () => {
  return useMutation({
    mutationFn: () => getPostImageUploadUrl(),
  })
}

export const useUploadPostImageMutation = () => {
  return useMutation({
    mutationFn: ({ imageUrl }: { imageUrl: string }) => uploadPostImage(imageUrl),
  })
}
