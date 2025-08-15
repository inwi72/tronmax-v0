"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FaucetNav } from "@/components/faucet-nav"

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Use admin navigation for admin pages
  const isAdminPage = pathname.startsWith("/admin")

  // Use faucet navigation for app pages
  const isFaucetPage =
    pathname.startsWith("/faucet") ||
    pathname.startsWith("/multiply") ||
    pathname.startsWith("/stake") ||
    pathname.startsWith("/referrals") ||
    pathname.startsWith("/stats") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/deposit")

  if (isAdminPage) {
    return (
      <div className="min-h-screen bg-gray-900">
        <nav className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-white">TronMax Admin</h1>
              </div>
              <div className="flex items-center space-x-4">
                <a
                  href="/admin/audit-logs"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Audit Logs
                </a>
                <a href="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Back to Site
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    )
  }

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
