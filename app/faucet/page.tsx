"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coins, Clock, Users, TrendingUp, Gift } from "lucide-react"

export default function FaucetPage() {
  const [balance, setBalance] = useState(0.0)
  const [timeLeft, setTimeLeft] = useState(3600) // 1 hour in seconds
  const [canClaim, setCanClaim] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPopunder, setShowPopunder] = useState(false)

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanClaim(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleClaim = async () => {
    setIsLoading(true)

    // Simulate claim process
    setTimeout(() => {
      setBalance((prev) => prev + 0.001)
      setTimeLeft(3600) // Reset to 1 hour
      setCanClaim(false)
      setIsLoading(false)
      setShowPopunder(true)

      // Hide popunder after 5 seconds
      setTimeout(() => setShowPopunder(false), 5000)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Top Ad Banner */}
      <div className="w-full h-24 bg-gray-800 border-b border-gray-700 flex items-center justify-center">
        <div className="bg-gray-700 rounded-lg px-4 py-2 text-gray-300">
          <span className="text-sm">Advertisement Space (728x90)</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Balance Display */}
        <div className="flex justify-end mb-6">
          <Badge variant="outline" className="bg-cyan-500/10 border-cyan-500 text-cyan-400 px-4 py-2 text-lg">
            <Coins className="w-5 h-5 mr-2" />
            Balance: {balance.toFixed(6)} TRX
          </Badge>
        </div>

        {/* Main Claim Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Free TRX Faucet
              </CardTitle>
              <p className="text-gray-300 text-lg mt-2">Claim Free TRX Every Hour & Earn More With Bonuses!</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Claim Button */}
              <div className="text-center">
                {canClaim ? (
                  <Button
                    onClick={handleClaim}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-12 py-4 text-xl font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                        Claiming...
                      </div>
                    ) : (
                      <>
                        <Gift className="w-6 h-6 mr-2" />
                        CLAIM FREE TRX
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="text-center">
                    <Button disabled className="bg-gray-600 text-gray-400 px-12 py-4 text-xl font-bold rounded-xl">
                      <Clock className="w-6 h-6 mr-2" />
                      Next claim in: {formatTime(timeLeft)}
                    </Button>
                  </div>
                )}
              </div>

              {/* reCAPTCHA Placeholder */}
              <div className="flex justify-center">
                <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-400 mb-2">Cloudflare Turnstile (Test Mode)</div>
                  <div className="w-64 h-16 bg-gray-600 rounded flex items-center justify-center">
                    <span className="text-gray-300">✓ Verification Complete</span>
                  </div>
                </div>
              </div>

              {/* Reward Info */}
              <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">0.001 TRX</div>
                  <div className="text-gray-300">Reward Amount</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">1,234,567 TRX</div>
              <div className="text-gray-300 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Total Paid
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">45,678</div>
              <div className="text-gray-300 flex items-center justify-center">
                <Users className="w-4 h-4 mr-2" />
                Active Users
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">8,901</div>
              <div className="text-gray-300 flex items-center justify-center">
                <Gift className="w-4 h-4 mr-2" />
                Today's Claims
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Ad Banner */}
        <div className="w-full h-24 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center">
          <div className="bg-gray-700 rounded-lg px-4 py-2 text-gray-300">
            <span className="text-sm">Advertisement Space (728x90)</span>
          </div>
        </div>
      </div>

      {/* Popunder Modal */}
      {showPopunder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-gray-800 border-gray-700 max-w-md mx-4">
            <CardHeader>
              <CardTitle className="text-center text-cyan-400">Congratulations!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-300">You've successfully claimed 0.001 TRX!</p>
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-yellow-400 font-bold">MULTIPLY YOUR TRX PLAYING HI-LO</p>
                <p className="text-gray-300 text-sm mt-2">Double your earnings with our exciting Hi-Lo game!</p>
              </div>
              <Button onClick={() => setShowPopunder(false)} className="bg-cyan-500 hover:bg-cyan-600 text-white">
                Continue
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
