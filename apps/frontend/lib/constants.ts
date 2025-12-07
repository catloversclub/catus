export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "https://api.catus.app"

export const STORAGE_URL =
  process.env.NEXT_PUBLIC_STORAGE_URL || "https://storage.catus.app/catus-media"
