"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Menu,
  X,
  Coins,
  Home,
  Gamepad2,
  Users,
  BarChart3,
  LogOut,
  Wallet,
  User,
  CreditCard,
  HelpCircle,
} from "lucide-react"

export function FaucetNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [balance] = useState(0.00010851)

  const navItems = [
    { href: "/faucet", label: "Free Deposit", icon: Home },
    { href: "/multiply", label: "Double Deposit", icon: Gamepad2 },
    { href: "/stake", label: "Win Deposit", icon: Wallet },
    { href: "/referrals", label: "Referral", icon: Users },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/deposit", label: "Deposit/Withdrawal", icon: CreditCard },
    { href: "/faq", label: "FAQ", icon: HelpCircle },
  ]

  return (
    <nav className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-tronmax-green to-green-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-tronmax-green to-green-400 bg-clip-text text-transparent">
              TRONMAX
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-1 text-gray-300 hover:text-tronmax-green transition-colors text-sm"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Balance and Logout */}
          <div className="hidden md:flex items-center space-x-4">
            <Badge variant="outline" className="bg-tronmax-green/10 border-tronmax-green text-tronmax-green">
              <Coins className="w-4 h-4 mr-1" />
              {balance.toFixed(8)} Deposit
            </Badge>
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-red-400">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-2 text-gray-300 hover:text-tronmax-green transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              <div className="pt-3 border-t border-gray-700">
                <Badge variant="outline" className="bg-tronmax-green/10 border-tronmax-green text-tronmax-green mb-3">
                  <Coins className="w-4 h-4 mr-1" />
                  {balance.toFixed(8)} Deposit
                </Badge>
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-red-400 w-full justify-start">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
