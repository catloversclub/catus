import { getServerSession } from "@/lib/auth/getServerSession"
// import { redirect } from "next/navigation"

export default async function PostLoginPage() {
  const session = await getServerSession()

  // if (!session) {
  //   redirect("/login")
  // }

  // if (session.onboardingRequired) {
  //   redirect("/onboarding/nickname")
  // }

  // redirect("/")

  if (!session) return <div>Login Failed</div>

  // 화면에는 JSON 데이터만 깔끔하게 출력합니다.
  // RN 웹뷰가 이 텍스트를 읽어갈 것입니다.
  return (
    <pre id="session-data">
      {JSON.stringify({
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        user: session.user,
        onboardingRequired: session.onboardingRequired,
      })}
    </pre>
  )
}
