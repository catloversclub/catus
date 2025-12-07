"use client"

import React, { useRef, useState } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import catAvatar from "@/public/cat-avatar.svg"
import { uploadCatImage } from "@/lib/image-upload"
import { toast } from "sonner"

interface CatImageUploadProps {
  value?: string
  onChange: (file: File | null, previewUrl?: string, uploadedUrl?: string) => void
  className?: string
  catId?: string
  onUploadStart?: () => void
  onUploadEnd?: () => void
}

export function CatImageUpload({
  value,
  onChange,
  className,
  catId,
  onUploadStart,
  onUploadEnd,
}: CatImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(value || null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileSelect = async (file: File | null) => {
    if (!file) {
      setPreview(null)
      onChange(null)
      return
    }

    // 파일 크기 체크 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("파일 크기는 5MB 이하여야 합니다.")
      return
    }

    // 이미지 파일인지 체크
    if (!file.type.startsWith("image/")) {
      toast.error("이미지 파일만 업로드 가능합니다.")
      return
    }

    // 미리보기 생성
    const reader = new FileReader()
    reader.onloadend = () => {
      const previewUrl = reader.result as string
      setPreview(previewUrl)

      if (catId) {
        handleUpload(catId, file, previewUrl)
      } else {
        onChange(file, previewUrl)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async (catId: string, file: File, previewUrl: string) => {
    setIsUploading(true)
    onUploadStart?.()

    try {
      const uploadedUrl = await uploadCatImage(catId, file)
      setPreview(uploadedUrl)
      onChange(file, uploadedUrl, uploadedUrl)
      toast.success("이미지가 업로드되었습니다.")
    } catch (error) {
      toast.error("이미지 업로드에 실패했습니다.")
      onChange(file, previewUrl)
    } finally {
      setIsUploading(false)
      onUploadEnd?.()
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    handleFileSelect(file)
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="flex w-full items-center justify-center">
        {preview ? (
          <div className="bg-background-secondary relative size-[106px] overflow-hidden rounded-full">
            <img
              src={preview}
              alt="고양이 프로필 미리보기"
              className="h-full w-full object-cover"
            />
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-xs text-white">업로드 중...</div>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={handleClick}
            disabled={isUploading}
            className="bg-background-secondary relative size-[106px] overflow-hidden rounded-full disabled:opacity-50"
          >
            <Image
              src={catAvatar}
              alt="고양이 프로필 미리보기"
              width={106}
              height={106}
              className="size-full object-cover"
            />
          </button>
        )}
      </div>
    </div>
  )
}
