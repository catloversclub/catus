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

/**
 * 날짜 문자열을 한글 형식으로 포맷팅합니다.
 * @param dateStr - YYYY-MM-DD 형식의 날짜 문자열
 * @param fallback - 날짜가 없을 때 반환할 기본값 (기본값: null)
 * @returns 포맷팅된 날짜 문자열 또는 fallback 값
 */
export function formatDate(dateStr?: string, fallback: string | null = null): string | null {
  if (!dateStr) return fallback
  const [year, month, day] = dateStr.split("-")
  return `${year}년 ${parseInt(month)}월 ${parseInt(day)}일`
}

