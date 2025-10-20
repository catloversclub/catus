import { KakaoLoginButton } from "@/components/auth/kakao-login-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <main className="flex flex-col items-center text-center max-w-[336px] w-full">
        <div className="flex flex-col gap-1.5 w-full">
          <KakaoLoginButton />
          <Button asChild variant="ghost" className="w-full underline">
            <Link href="/support">로그인 과정에 문제가 있나요?</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
