"use client"
declare global {
  interface Window {
    ReactNativeWebView: any
  }
}
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { isInWebView, notifyOnboardingComplete } from "@/lib/webview-bridge"

export default function OnboardingCompletePage() {
  const router = useRouter()

  const handleStart = () => {
    // 1. 웹뷰 환경이면 RN으로 신호 전송
    if (isInWebView()) {
      notifyOnboardingComplete()
    } else {
      // 2. 브라우저면 그냥 이동 (테스트 용도 등)
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
        {/* onClick 핸들러 교체 */}
        <Button onClick={handleStart}>시작하기</Button>

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
