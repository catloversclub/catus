import type { Request } from "express"
import type { Provider } from "@prisma/client"

export interface AuthenticatedRequest extends Request {
  user: {
    id: string | null
    identity: {
      provider: Provider
      id: string
    }
  }
}
