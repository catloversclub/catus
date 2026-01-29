import type { Metadata } from "next"
import "./globals.css"
import { MobileWrapper } from "@/components/mobile-wrapper"
import { AuthProvider } from "@/components/providers/session-provider"
import { Toaster } from "@/components/ui/sonner"

import localFont from "next/font/local"
import { AuthSync } from "@/components/auth/AuthSync"

const pretendard = localFont({
  src: "../fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "100 900",
  variable: "--font-pretendard",
})

export const metadata: Metadata = {
  title: "Catus",
  description: "Catus",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`antialiased ${pretendard.variable}`}>
        <AuthProvider>
          <MobileWrapper>{children}</MobileWrapper>
          <Toaster />
          <AuthSync />
        </AuthProvider>
      </body>
    </html>
  )
}
