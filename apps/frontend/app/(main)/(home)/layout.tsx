import { FeedHeader } from "@/components/layout/feed-header"

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <FeedHeader />
      <main className="pt-[88px]">{children}</main>
    </div>
  )
}
