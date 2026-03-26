import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  createCat,
  deleteCat,
  getCatById,
  getCatImageUploadUrl,
  getMyCats,
  updateCat,
  uploadCatImage,
} from "./api"
import { CreateCatRequest, UpdateCatRequest } from "./types"

export const catKeys = {
  all: ["cat"] as const,
  list: () => [...catKeys.all, "list"] as const,
  detail: (catId: number) => [...catKeys.all, "detail", catId] as const,
}

export const useMyCatsQuery = () => {
  return useQuery({
    queryKey: catKeys.list(),
    queryFn: getMyCats,
  })
}

export const useCatByIdQuery = (catId: number) => {
  return useQuery({
    queryKey: catKeys.detail(catId),
    queryFn: () => getCatById(catId),
    enabled: !!catId,
  })
}

export const useCreateCatMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateCatRequest) => createCat(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catKeys.list() })
    },
  })
}

export const useUpdateCatMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ catId, payload }: { catId: number; payload: UpdateCatRequest }) =>
      updateCat(catId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: catKeys.list() })
      queryClient.invalidateQueries({ queryKey: catKeys.detail(variables.catId) })
    },
  })
}

export const useDeleteCatMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (catId: number) => deleteCat(catId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catKeys.list() })
    },
  })
}

export const useCatImageUploadUrlMutation = () => {
  return useMutation({
    mutationFn: (catId: number) => getCatImageUploadUrl(catId),
  })
}

export const useUploadCatImageMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ catId, imageUrl }: { catId: number; imageUrl: string }) =>
      uploadCatImage(catId, imageUrl),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: catKeys.detail(variables.catId) })
      queryClient.invalidateQueries({ queryKey: catKeys.list() })
    },
  })
}
