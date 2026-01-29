"use client"

import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { isInWebView, notifyLoginSuccess } from "@/lib/webview-bridge"

export function AuthSync() {
  const { data: session } = useSession()

  useEffect(() => {
    // 세션이 있고 + 웹뷰 환경이라면 -> RN으로 토큰 발송
    if (session && isInWebView()) {
      notifyLoginSuccess({
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        onboardingRequired: session.onboardingRequired,
      })
    }
  }, [session])

  return null
}
