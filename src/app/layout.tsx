import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/providers/ThemeProvider"
import { SessionProvider } from "@/providers/SessionProvider"
import { ThemeToggle } from "@/components/ThemeToggle"
import type React from "react" // Import React

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "My Next.js App",
  description: "A production-grade Next.js web app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <div className="min-h-screen flex flex-col">
              <div className="absolute top-0 right-0 p-4">
                <ThemeToggle />
              </div>
              {children}
            </div>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}

