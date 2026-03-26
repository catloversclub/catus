import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { createComment, deleteComment, getPostComments, likeComment, unlikeComment } from "./api"
import { CreateCommentRequest } from "./types"

export const commentKeys = {
  all: ["comment"] as const,
  byPost: (postId: number) => [...commentKeys.all, "post", postId] as const,
}

export const usePostCommentsQuery = (postId: number) => {
  return useQuery({
    queryKey: commentKeys.byPost(postId),
    queryFn: () => getPostComments(postId),
    enabled: !!postId,
  })
}

export const useCreateCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, payload }: { postId: number; payload: CreateCommentRequest }) =>
      createComment(postId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.byPost(variables.postId) })
    },
  })
}

export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, commentId }: { postId: number; commentId: number }) =>
      deleteComment(commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.byPost(variables.postId) })
    },
  })
}

export const useLikeCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, commentId }: { postId: number; commentId: number }) =>
      likeComment(commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.byPost(variables.postId) })
    },
  })
}

export const useUnlikeCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, commentId }: { postId: number; commentId: number }) =>
      unlikeComment(commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.byPost(variables.postId) })
    },
  })
}
