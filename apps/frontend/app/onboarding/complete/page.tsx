"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { isInWebView, notifyOnboardingComplete } from "@/lib/webview-bridge"

export default function OnboardingCompletePage() {
  const router = useRouter()

  const handleStart = () => {
    if (isInWebView()) {
      // 1. 웹뷰: RN에게 "끝났어, 탭화면으로 넘겨줘" 신호 전송
      notifyOnboardingComplete()
    } else {
      // 2. 웹 브라우저: 그냥 홈으로 이동
      router.push("/")
    }
  }

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
        <Button onClick={handleStart}>시작하기</Button>
      </div>
    </div>
  )
}
