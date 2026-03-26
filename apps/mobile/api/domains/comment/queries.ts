import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"

import { createComment, deleteComment, getPostComments, likeComment, unlikeComment } from "./api"
import { CreateCommentRequest } from "./types"

export const commentKeys = {
  all: ["comment"] as const,
  byPost: (postId: string) => [...commentKeys.all, "post", postId] as const,
}

export const usePostCommentsQuery = (postId: string) => {
  return useSuspenseQuery({
    queryKey: commentKeys.byPost(postId),
    queryFn: () => getPostComments(postId),
  })
}

export const useCreateCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, payload }: { postId: string; payload: CreateCommentRequest }) =>
      createComment(postId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.byPost(variables.postId) })
    },
  })
}

export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, commentId }: { postId: string; commentId: string }) =>
      deleteComment(commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.byPost(variables.postId) })
    },
  })
}

export const useLikeCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, commentId }: { postId: string; commentId: string }) =>
      likeComment(commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.byPost(variables.postId) })
    },
  })
}

export const useUnlikeCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, commentId }: { postId: string; commentId: string }) =>
      unlikeComment(commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.byPost(variables.postId) })
    },
  })
}
