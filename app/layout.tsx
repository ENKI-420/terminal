import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Inter } from "next/font/google"

// Load Inter font
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata = {
  title: "AIDEN - Adaptive Integrated Defense and Execution Node",
  description: "Advanced cybersecurity and defense system",
  viewport: "width=device-width, initial-scale=1",
  // Add proper meta tags for content loading
  metadataBase: new URL("https://your-domain.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-domain.vercel.app",
    title: "AIDEN - Adaptive Integrated Defense and Execution Node",
    description: "Advanced cybersecurity and defense system",
    siteName: "AIDEN Terminal",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable}`}>
      <head>
        <title>AIDEN - Adaptive Integrated Defense and Execution Node</title>
        <meta name="description" content="Advanced cybersecurity and defense system" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/hack-font@3/build/web/hack.css" />
        {/* Add preconnect for vusercontent.net */}
        <link rel="preconnect" href="https://lite.vusercontent.net" />
        <link rel="dns-prefetch" href="https://lite.vusercontent.net" />
      </head>
      <body className="min-h-screen bg-neutral-950 antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {/* Skip link for accessibility */}
          <a href="#main-content" className="skip-link">
            Skip to content
          </a>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'