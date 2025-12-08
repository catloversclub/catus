"use client"

import { KakaoLogoutButton } from "@/components/auth/kakao-logout-button"

export default function LogoutPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <KakaoLogoutButton />
      </div>
    </div>
  )
}

