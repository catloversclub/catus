import { Button } from "@/components/ui/button";
import { KakaoLogoutButton } from "@/components/auth/kakao-logout-button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <main className="flex flex-col items-center gap-4 text-center max-w-[336px] w-full">
        <h1 className="text-3xl font-bold text-foreground mb-4">Welcome to Catus</h1>
        <Link href="/design-system" className="w-full">
          <Button className="w-full">
            Design System
          </Button>
        </Link>
        <KakaoLogoutButton />
      </main>
    </div>
  );
}
