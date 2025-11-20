"use client"

import Image from "next/image"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function FeedHeader() {
  return (
    <header className="fixed top-0 right-0 left-0 z-20 bg-white px-3 pt-9 pb-3">
      <Image src="/logos/logo.svg" alt="CatUs" width={81} height={24} className="mb-3" />
      <Tabs defaultValue="following">
        <TabsList>
          <TabsTrigger value="following">팔로잉</TabsTrigger>
          <TabsTrigger value="recommended">추천</TabsTrigger>
        </TabsList>
      </Tabs>
    </header>
  )
}
