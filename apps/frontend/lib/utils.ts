import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import ky from "ky"
import type { Options } from "ky"
import { API_BASE_URL } from "./constants"
import { auth } from "./auth/getClientSession"
import type { ExtendedSession } from "./auth/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const getSession = auth()

export const fetcher = ky.create({
  prefixUrl: API_BASE_URL,
  retry: 0,
  timeout: 5000,
  throwHttpErrors: false,
})

export const fetcherWithAuth = fetcher.extend({
  hooks: {
    beforeRequest: [
      async (request: Request) => {
        const session = (await getSession()) as ExtendedSession | null
        // During onboarding, accessToken may be sub=null and blocked by backend guard.
        // Use idToken until tokens are upgraded.
        const token = session?.onboardingRequired ? session?.idToken : session?.accessToken
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`)
        }
      },
    ],
    afterResponse: [
      async (request: Request, options: Options, response: Response) => {
        if (response.status === 401) {
          const session = (await getSession()) as ExtendedSession | null
          const token = session?.onboardingRequired ? session?.idToken : session?.accessToken
          if (token) {
            request.headers.set("Authorization", `Bearer ${token}`)
            return fetcher(request, { ...options, hooks: {} })
          }
        }
        return response
      },
    ],
  },
})
