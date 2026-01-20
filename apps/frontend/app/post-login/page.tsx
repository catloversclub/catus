import { getServerSession } from "@/lib/auth/getServerSession"
import { redirect } from "next/navigation"

export default async function PostLoginPage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/login")
  }

  if (session.onboardingRequired) {
    redirect("/onboarding/nickname")
  }

  redirect("/")
}
