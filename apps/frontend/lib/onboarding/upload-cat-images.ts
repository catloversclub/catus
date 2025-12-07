import { fetcherWithAuth } from "../utils"
import { uploadCatImage } from "../image-upload"
import type { CatCreationResult } from "./create-cats"

function base64ToFile(base64Url: string, catId: string): File {
  const base64Data = base64Url.split(",")[1]
  const mimeType = base64Url.match(/data:([^;]+);/)?.[1] || "image/jpeg"
  const byteCharacters = atob(base64Data)
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  const blob = new Blob([byteArray], { type: mimeType })
  const file = new File([blob], `cat-${catId}.${mimeType.split("/")[1] || "jpg"}`, {
    type: mimeType,
  })
  return file
}

async function uploadSingleCatImage({
  createdCat,
  originalCat,
}: CatCreationResult): Promise<void> {
  if (!originalCat.imageUrl || !originalCat.imageUrl.startsWith("data:")) {
    return
  }

  try {
    const file = base64ToFile(originalCat.imageUrl, createdCat.id)

    const uploadedUrl = await uploadCatImage(createdCat.id, file)

    const updateResponse = await fetcherWithAuth.patch(`cat/${createdCat.id}`, {
      json: { profileImageUrl: uploadedUrl },
    })

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text()
      throw new Error(errorText || updateResponse.statusText)
    }
  } catch (error) {
    console.error("[onboarding] failed to upload image for cat:", createdCat.id, error)
    throw error
  }
}

/**
 * 여러 고양이의 이미지를 업로드
 */
export async function uploadCatImages(
  catResults: CatCreationResult[]
): Promise<void> {
  if (catResults.length === 0) {
    return
  }

  // 모든 이미지 업로드를 병렬로 처리
  const uploadPromises = catResults.map((catResult) =>
    uploadSingleCatImage(catResult).catch((error) => {
      console.error(
        "[onboarding] failed to upload image for cat:",
        catResult.createdCat.id,
        error
      )
      return null
    })
  )

  await Promise.all(uploadPromises)
}

