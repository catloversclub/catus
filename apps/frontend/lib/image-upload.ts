import { fetcherWithAuth } from "./utils"
import { STORAGE_URL } from "./constants"

export interface PresignedUrlResponse {
  url: string
  fields: Record<string, string>
}

export async function getCatTemporaryImageUploadUrl(
  contentType: string
): Promise<PresignedUrlResponse> {
  const response = await fetcherWithAuth.post("cat/image/upload-url", {
    json: { contentType },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || response.statusText)
  }

  const result = await response.json<PresignedUrlResponse>()

  return result
}

export async function uploadCatImageTemporary(file: File): Promise<string> {
  const { fields } = await getCatTemporaryImageUploadUrl(file.type)
  const imageUrl = await uploadImageToStorage(fields, file)
  return imageUrl
}

export async function getCatImageUploadUrl(
  catId: string,
  contentType: string
): Promise<PresignedUrlResponse> {
  const response = await fetcherWithAuth.post(`cat/${catId}/image/upload-url`, {
    json: { contentType },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || response.statusText)
  }

  const result = await response.json<PresignedUrlResponse>()
  return result
}

export async function uploadImageToStorage(
  fields: Record<string, string>,
  file: File
): Promise<string> {
  const formData = new FormData()

  Object.entries(fields).forEach(([key, value]) => {
    formData.append(key, value)
  })

  formData.append("file", file)

  const uploadUrl = STORAGE_URL

  try {
    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText || response.statusText)
    }

    const key = fields.key
    if (!key) {
      throw new Error("Key not found in presigned URL fields")
    }

    const imageUrl = `${STORAGE_URL}/${key}`

    return imageUrl
  } catch (error) {
    throw error
  }
}

export async function uploadCatImage(catId: string, file: File): Promise<string> {
  const { fields } = await getCatImageUploadUrl(catId, file.type)
  const imageUrl = await uploadImageToStorage(fields, file)
  return imageUrl
}
