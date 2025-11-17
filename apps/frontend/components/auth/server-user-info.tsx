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

  if (!session) {
    return null
  }

  return (
    <div className="bg-background-secondary border-border w-full rounded-lg border p-4">
      <div className="flex items-center gap-3">
        {session.user?.image && (
          <Image
            src={session.user.image}
            alt="프로필 이미지"
            width={48}
            height={48}
            className="h-12 w-12 rounded-full object-cover"
          />
        )}
        <h3 className="text-foreground font-semibold">{session.user?.name || "사용자"}</h3>
      </div>
    </div>
  )
}
