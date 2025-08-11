import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Footer from "@/components/footer"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SimuClient - Plateforme de simulation Talan",
  description: "Plateforme de simulation intelligente de réunions clients pour renforcer les compétences des managers",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
