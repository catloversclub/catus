"use client"

import React, { useRef, useState } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import catAvatar from "@/public/cat-avatar.svg"

interface CatImageUploadProps {
  value?: string // 이미지 URL 또는 base64
  onChange: (file: File | null, previewUrl?: string) => void
  className?: string
}

export function CatImageUpload({ value, onChange, className }: CatImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(value || null)

  const handleFileSelect = (file: File | null) => {
    if (!file) {
      setPreview(null)
      onChange(null)
      return
    }

    // 파일 크기 체크 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다.")
      return
    }

    // 이미지 파일인지 체크
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const previewUrl = reader.result as string
      setPreview(previewUrl)
      onChange(file, previewUrl)
    }
    reader.readAsDataURL(file)
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
          </div>
        ) : (
          <button
            type="button"
            onClick={handleClick}
            className="bg-background-secondary relative size-[106px] overflow-hidden rounded-full"
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
