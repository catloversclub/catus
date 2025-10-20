import type { Session } from "next-auth"

export interface ExtendedSession extends Session {
  token?: {
    accessTokenExpires?: number
  }
}
