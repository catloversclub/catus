import { getServerSession } from "@/lib/auth/getServerSession"
import { apiFetch } from "@/lib/api"
import Image from "next/image"
import { redirect } from "next/navigation"

export async function ServerUserInfo() {
  const session = await getServerSession()

  if (!session) {
    redirect("/login")
  }

  const idToken = session.idToken
  console.log("[ServerUserInfo] session:", JSON.stringify(session))
  if (!idToken) {
    redirect("/onboarding/nickname")
  }

  // TODO: 이 코드가 유효할지는 회원가입 구현 후 확인 필요
  if (idToken) {
    try {
      const user = await apiFetch("/user/me", { authToken: idToken })
      console.log(user)
    } catch (error) {
      console.error(error)
      redirect("/onboarding/nickname")
    }
  }

  return (
    <div className="bg-background-secondary rounded-lg p-4 border border-border w-full">
      <div className="flex items-center gap-3">
        {session.user?.image && (
          <Image
            src={session.user.image}
            alt="프로필 이미지"
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover"
          />
        )}
        <h3 className="font-semibold text-foreground">{session.user?.name || "사용자"}</h3>
      </div>
    </div>
  )
}
