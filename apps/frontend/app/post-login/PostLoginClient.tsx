"use client"
import { useEffect } from "react"
import { WEBVIEW_MESSAGE_TYPE } from "@catus/constants" // 공유 상수가 있다면 사용
import { getServerSession } from "next-auth"

export function PostLoginClient() {
  useEffect(() => {
    const handleSession = async () => {
      const session = await getServerSession()
      // 1. RN 환경인지 확인
      if (window.ReactNativeWebView) {
        const message = {
          type: WEBVIEW_MESSAGE_TYPE.LOGIN_SUCCESS,
          payload: {
            accessToken: session?.accessToken,
            refreshToken: session?.refreshToken,
            onboardingRequired: session?.onboardingRequired,
          },
        }

        // 2. RN 앱으로 메시지 전송
        window.ReactNativeWebView.postMessage(JSON.stringify(message))
      }

      handleSession()
    }
  }, [])

  return (
    <div className="flex h-screen items-center justify-center">
      <p>로그인 처리 중입니다...</p>
      {/* 백업용 데이터 표시 (디버깅용) */}
      {/* <pre className="hidden">{JSON.stringify(session)}</pre> */}
    </div>
  )
}
