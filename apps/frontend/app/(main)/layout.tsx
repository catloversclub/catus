import { BottomNav } from "@/components/feed/bottom-nav"
import { FeedHeader } from "@/components/feed/feed-header"

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen">
      <FeedHeader />
      <main className="pt-[88px]">{children}</main>
      <BottomNav />
    </div>
  )
}
