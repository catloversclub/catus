import { getServerSession } from "@/lib/auth/getServerSession"
import Image from "next/image"

export async function ServerUserInfo() {
  const session = await getServerSession()

  // if (!session || !session.user) {
  //   redirect("/login")
  // }

  // const idToken = (session as any).idToken as string | undefined

  // if (!idToken) {
  //   redirect("/onboarding/nickname")
  // }

  // try {
  //   await apiFetch("/user/me", { authToken: idToken })
  // } catch {
  //   redirect("/onboarding/nickname")
  // }

  console.log(session)

  if(!session) {
    return null
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
