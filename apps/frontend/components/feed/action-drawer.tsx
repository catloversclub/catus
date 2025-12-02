"use client"

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Bell, BellOff, MoreVertical, Share2, UserCircle } from "lucide-react"
import Image from "next/image"

interface ActionDrawerProps {
  postAuthorName: string
  postAuthorImage: string
  isNotificationEnabled?: boolean
  onNotificationToggle?: () => void
  onBlock?: () => void
  onShare?: () => void
  onViewProfile?: () => void
}

export function ActionDrawer({
  postAuthorName,
  postAuthorImage,
  isNotificationEnabled = false,
  onNotificationToggle,
  onBlock,
  onShare,
  onViewProfile,
}: ActionDrawerProps) {
  const handleAction = (action?: () => void) => {
    if (action) {
      action()
    }
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" className="p-2">
          <MoreVertical className="text-icon-tertiary h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="pb-8">
        <DrawerHeader>
          <DrawerTitle className="text-text-secondary text-center text-base">Tlsrh?</DrawerTitle>
        </DrawerHeader>
        <button
          onClick={() => handleAction(() => console.log("신고하기"))}
          className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50"
        >
          <Bell className="h-6 w-6 text-gray-700" />
          <div className="flex flex-1 items-center justify-between">
            <span className="text-base font-medium">신고하기</span>
            <div className="flex items-center gap-2">
              <Image
                src={postAuthorImage}
                alt={postAuthorName}
                width={24}
                height={24}
                className="h-6 w-6 rounded-full object-cover"
              />
              <span className="text-sm text-gray-500">{postAuthorName}</span>
            </div>
          </div>
        </button>

        {/* 구분선 */}
        <div className="bg-secondary h-2" />

        {/* 차단하기 */}
        <button
          onClick={() => handleAction(onBlock)}
          className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50"
        >
          <BellOff className="h-6 w-6 text-gray-700" />
          <span className="text-base font-medium">차단하기</span>
        </button>

        {/* 구분선 */}
        <div className="bg-secondary h-2" />

        {/* 공유하기 */}
        <button
          onClick={() => handleAction(onShare)}
          className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50"
        >
          <Share2 className="h-6 w-6 text-gray-700" />
          <span className="text-base font-medium">공유하기</span>
        </button>

        {/* 구분선 */}
        <div className="bg-secondary h-2" />

        {/* 프로필 방문하기 */}
        <button
          onClick={() => handleAction(onViewProfile)}
          className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50"
        >
          <UserCircle className="h-6 w-6 text-gray-700" />
          <span className="text-base font-medium">프로필 방문하기</span>
        </button>
      </DrawerContent>
    </Drawer>
  )
}
