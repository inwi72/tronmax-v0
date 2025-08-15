"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FaucetNav } from "@/components/faucet-nav"

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Use faucet navigation for app pages
  const isFaucetPage =
    pathname.startsWith("/faucet") ||
    pathname.startsWith("/multiply") ||
    pathname.startsWith("/stake") ||
    pathname.startsWith("/referrals") ||
    pathname.startsWith("/stats")

  if (isFaucetPage) {
    return (
      <>
        <FaucetNav />
        {children}
      </>
    )
  }

  // Use landing page layout for home page
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}
