import { BottomNav } from "@/components/feed/bottom-nav"

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen">
      <main>{children}</main>
    </div>
  )
}
