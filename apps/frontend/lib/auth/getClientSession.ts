import type { Session } from "next-auth"
import { getSession } from "next-auth/react"
import type { ExtendedSession } from "./types"

export const getClientSession = () => {
  let session: Session | null = null

  return async () => {
    const extendedSession = session as ExtendedSession
    const isExpired = extendedSession.token?.accessTokenExpires
      ? extendedSession.token.accessTokenExpires < Date.now()
      : true

    if (!session || isExpired) {
      session = await getSession()
    }

    return session
  }
}
