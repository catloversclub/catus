import { API_BASE_URL } from "./constants"

type ApiFetchOptions = RequestInit & {
  authToken?: string | null
}

export async function apiFetch<T = unknown>(
  path: string,
  { authToken, headers, ...init }: ApiFetchOptions = {}
): Promise<T> {
  const url = path.startsWith("http")
    ? path
    : `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`

  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...(headers || {}),
    },
    cache: init.cache ?? "no-store",
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`API ${res.status}: ${text || res.statusText}`)
  }

  const contentType = res.headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    return (await res.json()) as T
  }
  return (await res.text()) as unknown as T
}
