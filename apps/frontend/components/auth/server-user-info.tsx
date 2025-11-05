import { getServerSession } from "@/lib/auth/getServerSession"
import Image from "next/image"
import { redirect } from "next/navigation"

export async function ServerUserInfo() {
  const session = await getServerSession()

  if (!session) {
    redirect("/login")
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
