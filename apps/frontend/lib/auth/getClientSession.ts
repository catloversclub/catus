import type { Session } from "next-auth"
import { getSession } from "next-auth/react"
import type { ExtendedSession } from "./types"

export const auth = () => {
  let session: Session | null = null

  return async () => {
    const extendedSession = session as ExtendedSession | null
    const isExpired =
      extendedSession?.accessTokenExpires != null
        ? extendedSession.accessTokenExpires < Date.now()
        : true

    // While onboardingRequired, keep session fresh so the server can "upgrade" tokens
    // after /user is created (re-exchange id_token -> app tokens with userId + refreshToken).
    if (!session || isExpired || extendedSession?.onboardingRequired) {
      session = await getSession()
    }

    return session
  }
}
