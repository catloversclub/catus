export const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
}

export function getImageExtension(contentType: string): string | undefined {
  return ALLOWED_IMAGE_TYPES[contentType]
}
