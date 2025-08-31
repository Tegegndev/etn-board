import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { TonConnectUIProvider } from "@tonconnect/ui-react"
import { Suspense } from "react"
import { Navigation } from "@/components/navigation"

export const metadata: Metadata = {
  title: "ETN Board - Crypto Bulletin Board",
  description: "A crypto-native bulletin board with TON wallet integration",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
      <body>
        <Suspense fallback={<div>Loading...</div>}>
          <TonConnectUIProvider
            manifestUrl="https://etn.ethio-tech.com/brand-assets/tonconnect-manifest.json"
            uiPreferences={{
              theme: "DARK",
            }}
          >
            <Navigation />
            {children}
          </TonConnectUIProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
