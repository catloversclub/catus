import type { Metadata } from "next";
import "./globals.css";
import { MobileWrapper } from "@/components/mobile-wrapper";
import { AuthProvider } from "@/components/providers/session-provider";

import localFont from "next/font/local";

const pretendard = localFont({
  src: "../fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "100 900",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "Catus",
  description: "Catus",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased ${pretendard.variable}`}>
        <AuthProvider>
          <MobileWrapper>{children}</MobileWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
