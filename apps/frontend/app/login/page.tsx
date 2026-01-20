import { KakaoLoginButton } from "@/components/auth/kakao-login-button"
import { Button } from "@/components/ui/button"
import { getServerSession } from "@/lib/auth/getServerSession"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function Login() {
  const session = await getServerSession()
  if (session) {
    if (session.onboardingRequired) {
      redirect("/onboarding/nickname")
    }
    redirect("/")
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <main className="flex w-full max-w-[336px] flex-col items-center text-center">
        <div className="flex w-full flex-col gap-1.5">
          <KakaoLoginButton />
          <Button asChild variant="ghost" className="w-full underline">
            <Link href="/support">로그인 과정에 문제가 있나요?</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
