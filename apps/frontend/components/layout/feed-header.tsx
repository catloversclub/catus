"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function FeedHeader() {
  return (
    <header className="fixed top-0 right-0 left-0 z-20 bg-white px-3 pt-1 pb-3">
      <object data="/logos/logo.svg" className="mx-2 h-auto w-20" />
      <Tabs defaultValue="following">
        <TabsList>
          <TabsTrigger value="following">팔로잉</TabsTrigger>
          <TabsTrigger value="recommended">추천</TabsTrigger>
        </TabsList>
      </Tabs>
    </header>
  )
}
