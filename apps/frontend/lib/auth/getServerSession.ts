import { getServerSession as getServerSessionOriginal } from "next-auth/next"
import { authOptions } from "./authOptions"

export const getServerSession = async () => {
  return await getServerSessionOriginal(authOptions)
}
