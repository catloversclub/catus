import { FeedHeader } from "@/components/feed/feed-header"
import { FeedList } from "@/components/feed/feed-list"
import { BottomNav } from "@/components/feed/bottom-nav"

export default function Home() {
  return (
    <div className="min-h-screen">
      <FeedHeader />
      <main className="pt-[146px]">
        <FeedList />
      </main>
      <BottomNav />
    </div>
  )
}
