import { Button } from "@/components/ui/button";
import { getServerSession } from "@/lib/auth/getServerSession";
import Link from "next/link";
import Image from "next/image";

export async function ServerUserInfo() {
  const session = await getServerSession();

  if (!session) {
    return (
      <div className="text-center">
        <p className="text-text-secondary mb-4">로그인이 필요합니다</p>
        <Button asChild>
          <Link href="/login">로그인하기</Link>
        </Button>
      </div>
    );
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
  );
}
