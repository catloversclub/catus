"use client"

import Image from "next/image"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function FeedHeader() {
  return (
    <header className="fixed top-0 right-0 left-0 z-10 bg-white">
      <div className="flex flex-col justify-start px-4 py-1 pt-9 pb-10">
        {/* 로고 */}
        <Image src="/logos/logo.svg" alt="CatUs" width={81} height={24} />
      </div>
      {/* 탭 */}
      <Tabs defaultValue="following">
        <TabsList>
          <TabsTrigger value="following">팔로잉</TabsTrigger>
          <TabsTrigger value="recommended">추천</TabsTrigger>
        </TabsList>
      </Tabs>
    </header>
  )
}
