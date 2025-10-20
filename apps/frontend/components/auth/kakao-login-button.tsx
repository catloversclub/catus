"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function KakaoLoginButton() {
  const handleKakaoLogin = () => {
    signIn("kakao", { callbackUrl: "/" })
  }

  return (
    <Button onClick={handleKakaoLogin} className="w-full">
      카카오로 시작하기
    </Button>
  )
}
