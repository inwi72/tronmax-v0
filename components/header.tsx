"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="bg-black border-b-2 border-tronmax-green sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo/Brand */}
        <Link
          href="/"
          className="text-2xl font-bold text-tronmax-green font-mono hover:text-tronmax-green-hover transition-colors"
        >
          TronMax
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-tronmax-green hover:text-tronmax-green-hover font-semibold transition-colors">
            Home
          </Link>
          <Link
            href="/faucet"
            className="text-tronmax-green hover:text-tronmax-green-hover font-semibold transition-colors"
          >
            Faucet
          </Link>
          <Link
            href="#staking"
            className="text-tronmax-green hover:text-tronmax-green-hover font-semibold transition-colors"
          >
            Staking
          </Link>
          <Link
            href="/dashboard"
            className="text-tronmax-green hover:text-tronmax-green-hover font-semibold transition-colors"
          >
            Dashboard
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex space-x-2">
            <Link href="/auth/login">
              <Button
                variant="outline"
                size="sm"
                className="border-tronmax-green text-tronmax-green hover:bg-tronmax-green hover:text-black bg-transparent"
              >
                Login
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm" className="bg-tronmax-green text-black hover:bg-tronmax-green-hover">
                Register
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-tronmax-green hover:text-tronmax-green-hover">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>
    </header>
  )
}
