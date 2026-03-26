import { STORAGE_BAEE_URL } from "@/constants/api"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * ISO 8601 형식의 날짜 문자열을 받아 현재 시간 기준 상대 시간을 반환합니다.
 * @param dateString - 예: "2026-02-01T11:55:23.256Z"
 * @returns - "3분 전", "8시간 전", "1일 전" 등
 */
const formatRelativeTime = (dateString: string): string => {
  const now = new Date()
  const past = new Date(dateString)

  // 유효하지 않은 날짜 처리
  if (isNaN(past.getTime())) {
    return "유효하지 않은 날짜"
  }

  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  // 미래 시간 처리 (필요한 경우)
  if (diffInSeconds < 0) return "방금 전"

  // 단위 정의 (초 단위 기준)
  const units: { label: string; seconds: number }[] = [
    { label: "일", seconds: 86400 },
    { label: "시간", seconds: 3600 },
    { label: "분", seconds: 60 },
    { label: "초", seconds: 1 },
  ]

  for (const unit of units) {
    const interval = Math.floor(diffInSeconds / unit.seconds)

    if (interval >= 1) {
      return `${interval}${unit.label} 전`
    }
  }

  return "방금 전"
}

/**
 * 이미지 경로(url)를 받아 전체 스토리지 URL을 반환합니다.
 * @param path - 이미지 상대 경로 (예: "cats/image.jpg")
 * @returns - 전체 URL 문자열
 */
const getMediaUrl = (path: string | undefined | null): string => {
  if (!path) return "" // 경로가 없을 경우 빈 문자열 반환 (필요시 기본 이미지 URL 반환 가능)

  // 중복된 슬래시(//) 방지 및 결합
  const baseUrl = STORAGE_BAEE_URL.replace(/\/$/, "") // 끝의 / 제거
  const relativePath = path.replace(/^\//, "") // 앞의 / 제거

  return `${baseUrl}/${relativePath}`
}

export { cn, formatRelativeTime, getMediaUrl }
