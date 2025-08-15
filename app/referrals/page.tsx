"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Copy, Share2, TrendingUp, Coins, Gift, ExternalLink, CheckCircle, Clock } from "lucide-react"

export default function ReferralsPage() {
  const [referralLink] = useState("https://tronmax.io/ref/TRX123456")
  const [copied, setCopied] = useState(false)

  // Mock data
  const referralStats = {
    totalReferrals: 25,
    activeReferrals: 18,
    totalEarnings: 0.125,
    todayEarnings: 0.008,
    pendingEarnings: 0.012,
  }

  const referralHistory = [
    {
      id: 1,
      username: "User***123",
      joinDate: "2024-01-15",
      status: "active",
      earnings: 0.025,
      lastClaim: "2 hours ago",
    },
    {
      id: 2,
      username: "Cry***456",
      joinDate: "2024-01-14",
      status: "active",
      earnings: 0.018,
      lastClaim: "5 hours ago",
    },
    {
      id: 3,
      username: "Trx***789",
      joinDate: "2024-01-13",
      status: "inactive",
      earnings: 0.012,
      lastClaim: "2 days ago",
    },
    {
      id: 4,
      username: "Bit***321",
      joinDate: "2024-01-12",
      status: "active",
      earnings: 0.031,
      lastClaim: "1 hour ago",
    },
    {
      id: 5,
      username: "Eth***654",
      joinDate: "2024-01-11",
      status: "active",
      earnings: 0.019,
      lastClaim: "3 hours ago",
    },
  ]

  const commissionTiers = [
    { level: "Level 1", percentage: 50, description: "Direct referrals" },
    { level: "Level 2", percentage: 25, description: "Referrals of your referrals" },
    { level: "Level 3", percentage: 10, description: "Third level referrals" },
  ]

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareOnSocial = (platform: string) => {
    const text = "Join TRONMAX and earn free TRX every hour! Use my referral link:"
    const url = referralLink

    let shareUrl = ""
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        break
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
        break
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
            Referral Program
          </h1>
          <p className="text-gray-300">Earn 50% commission for life from your referrals!</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-cyan-400">{referralStats.totalReferrals}</div>
              <div className="text-sm text-gray-400">Total Referrals</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-400">{referralStats.activeReferrals}</div>
              <div className="text-sm text-gray-400">Active Referrals</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4 text-center">
              <Coins className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-400">{referralStats.totalEarnings.toFixed(6)}</div>
              <div className="text-sm text-gray-400">Total Earnings</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-400">{referralStats.todayEarnings.toFixed(6)}</div>
              <div className="text-sm text-gray-400">Today's Earnings</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-400">{referralStats.pendingEarnings.toFixed(6)}</div>
              <div className="text-sm text-gray-400">Pending Earnings</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-500">
              Overview
            </TabsTrigger>
            <TabsTrigger value="referrals" className="data-[state=active]:bg-cyan-500">
              My Referrals
            </TabsTrigger>
            <TabsTrigger value="commissions" className="data-[state=active]:bg-cyan-500">
              Commission Structure
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Referral Link */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Share2 className="w-5 h-5 mr-2" />
                  Your Referral Link
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input value={referralLink} readOnly className="bg-gray-700 border-gray-600 text-white flex-1" />
                  <Button onClick={copyToClipboard} className="bg-cyan-500 hover:bg-cyan-600">
                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>

                {/* Social Share Buttons */}
                <div className="flex gap-2 flex-wrap">
                  <Button
                    onClick={() => shareOnSocial("twitter")}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                    size="sm"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Twitter
                  </Button>
                  <Button
                    onClick={() => shareOnSocial("telegram")}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Telegram
                  </Button>
                  <Button
                    onClick={() => shareOnSocial("facebook")}
                    className="bg-blue-700 hover:bg-blue-800 text-white"
                    size="sm"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Facebook
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* How It Works */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gift className="w-5 h-5 mr-2" />
                  How Referrals Work
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-cyan-400">Share Your Link</h4>
                      <p className="text-gray-300 text-sm">Share your unique referral link with friends and family.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-cyan-400">They Sign Up</h4>
                      <p className="text-gray-300 text-sm">
                        When someone uses your link to register, they become your referral.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-cyan-400">Earn Commissions</h4>
                      <p className="text-gray-300 text-sm">
                        You earn 50% of their faucet claims and game winnings for life!
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="referrals">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle>Your Referrals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {referralHistory.map((referral) => (
                    <div
                      key={referral.id}
                      className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          {referral.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{referral.username}</div>
                          <div className="text-sm text-gray-400">Joined: {referral.joinDate}</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <Badge variant={referral.status === "active" ? "default" : "secondary"}>
                          {referral.status}
                        </Badge>
                        <div className="text-right">
                          <div className="font-semibold text-green-400">{referral.earnings.toFixed(6)} TRX</div>
                          <div className="text-sm text-gray-400">Last claim: {referral.lastClaim}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="commissions">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle>Commission Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {commissionTiers.map((tier, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600"
                    >
                      <div>
                        <h4 className="font-semibold text-cyan-400">{tier.level}</h4>
                        <p className="text-gray-300 text-sm">{tier.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-400">{tier.percentage}%</div>
                        <div className="text-sm text-gray-400">Commission</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg">
                  <h4 className="font-semibold text-cyan-400 mb-2">Lifetime Commissions</h4>
                  <p className="text-gray-300 text-sm">
                    All referral commissions are paid for life! There's no time limit on your earnings. The more active
                    your referrals are, the more you earn.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
