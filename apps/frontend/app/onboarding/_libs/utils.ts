import type { TagOption } from "@/app/onboarding/_libs/schemas"

export function renderTagRows(items: ReadonlyArray<TagOption>, chunkSize: number): TagOption[][] {
  return items.reduce<TagOption[][]>((rows, item, index) => {
    const rowIndex = Math.floor(index / chunkSize)
    if (!rows[rowIndex]) rows[rowIndex] = []
    rows[rowIndex]!.push(item)
    return rows
  }, [])
}

/**
 * 성별을 한글로 포맷팅합니다.
 * @param gender - 성별 값 ("male", "female", "unknown" 등)
 * @returns 포맷팅된 성별 문자열
 */
export function formatGender(gender?: string): string {
  switch (gender) {
    case "male":
      return "남자"
    case "female":
      return "여자"
    default:
      return "선택 안 함"
  }
}

interface FormatDateOptions {
  dateStr?: string
  fallback?: string | null
  format?: "korean" | "iso"
}

/**
 * 날짜 문자열을 포맷팅합니다.
 * @param options - 포맷팅 옵션
 * @param options.dateStr - YYYY-MM-DD 형식의 날짜 문자열
 * @param options.fallback - 날짜가 없을 때 반환할 기본값 (기본값: null)
 * @param options.format - 포맷 형식 ("korean" | "iso"), 기본값: "korean"
 * @returns 포맷팅된 날짜 문자열 또는 fallback 값
 */
export function formatDate({
  dateStr,
  fallback = null,
  format = "korean",
}: FormatDateOptions): string | null {
  if (!dateStr) return fallback
  const [year, month, day] = dateStr.split("-")
  
  if (format === "iso") {
    return dateStr // 이미 YYYY-MM-DD 형식이므로 그대로 반환
  }
  
  return `${year}년 ${parseInt(month)}월 ${parseInt(day)}일`
}

