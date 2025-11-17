"use client"

import Link from "next/link"
import { Home, Search, Camera, Bell, User } from "lucide-react"
import { usePathname } from "next/navigation"

export function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { icon: Home, href: "/", label: "홈" },
    { icon: Search, href: "/search", label: "검색" },
    { icon: Camera, href: "/upload", label: "업로드" },
    { icon: Bell, href: "/notifications", label: "알림" },
    { icon: User, href: "/profile", label: "프로필" },
  ]

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-10 border-t bg-white">
      <div className="mx-auto max-w-md">
        <div className="flex items-center justify-around py-2">
          {navItems.map(({ icon: Icon, href, label }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-1 p-2 ${
                  isActive ? "text-black" : "text-gray-400"
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="sr-only">{label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
