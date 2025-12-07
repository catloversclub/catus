import { fetcherWithAuth } from "../utils"
import type { CatData } from "@/components/onboarding/onboarding-context"

export interface CreateCatPayload {
  name: string
  gender: "MALE" | "FEMALE" | "UNKNOWN" | null
  profileImageUrl: null
  birthDate: Date | null
  breed: string | null
  personalities: number[]
  appearances: number[]
}

export interface CreatedCat {
  id: string
}

export interface CatCreationResult {
  createdCat: CreatedCat
  originalCat: CatData
}

export function convertGender(gender?: string): "MALE" | "FEMALE" | "UNKNOWN" | null {
  if (!gender) return null
  switch (gender) {
    case "male":
      return "MALE"
    case "female":
      return "FEMALE"
    case "unknown":
      return "UNKNOWN"
    default:
      return null
  }
}

function createCatPayload(cat: CatData): CreateCatPayload {
  return {
    name: cat.name,
    gender: convertGender(cat.gender),
    profileImageUrl: null, // 이미지는 나중에 업로드
    birthDate: cat.birthDate ? new Date(cat.birthDate) : null,
    breed: cat.breed || null,
    personalities: cat.personalities || [],
    appearances: cat.appearances || [],
  }
}

export async function createCats(cats: CatData[]): Promise<CatCreationResult[]> {
  if (cats.length === 0) {
    return []
  }

  // 모든 고양이 생성 요청
  const catPromises = cats.map((cat) => {
    const catPayload = createCatPayload(cat)
    return fetcherWithAuth.post("cat", { json: catPayload })
  })

  const catResponses = await Promise.all(catPromises)

  // 응답 파싱 및 원본 데이터와 매핑
  const catWithOriginal = await Promise.all(
    catResponses.map(async (res, index) => {
      if (res.ok) {
        const createdCat = await res.json<CreatedCat>()
        return { createdCat, originalCat: cats[index] }
      }
      return null
    })
  )

  // 성공한 고양이만 필터링
  const validCats = catWithOriginal.filter(
    (item): item is CatCreationResult => item !== null
  )

  return validCats
}

