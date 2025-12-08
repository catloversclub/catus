import { DefaultHeader } from "@/components/layout/default-header"
import { FeedHeader } from "@/components/layout/feed-header"

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <DefaultHeader title="검색" />
      <main className="pt-10">{children}</main>
    </div>
  )
}
