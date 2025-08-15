import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Dashboard | TronMax",
  description: "TronMax administrative dashboard for managing users, transactions, and platform settings.",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
