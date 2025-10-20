"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function KakaoLogoutButton() {
  const handleKakaoLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <Button onClick={handleKakaoLogout} variant="outline" className="w-full">
      로그아웃
    </Button>
  );
}
