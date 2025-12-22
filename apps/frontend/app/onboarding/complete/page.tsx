"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function OnboardingCompletePage() {
  const router = useRouter()

  return (
    <div className="flex min-h-0 flex-1 flex-col pt-10">
      <div className="scrollbar-hide flex-1 overflow-y-auto">
        <p className="text-text-primary mb-3 text-lg leading-7 font-bold">
          모든 준비가 끝났어요!
          <br />
          이제 귀여운 고양이들을 구경해볼까요? 👀
        </p>
      </div>

      <div className="flex flex-shrink-0 pt-4">
        <Button onClick={() => router.push("/")}>시작하기</Button>
        <Button
          variant="ghost"
          className="w-full underline"
          onClick={() => router.push("/support")}
        >
          CatUS 사용법 자세히 알아보기
        </Button>
      </div>
    </div>
  )
}
