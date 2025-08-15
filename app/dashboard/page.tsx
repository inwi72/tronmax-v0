"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Coins, Target, Calendar, Award, Activity, DollarSign } from "lucide-react"

export default function DashboardPage() {
  const stats = {
    totalBalance: 0.00010851,
    todayClaims: 8,
    totalClaims: 1247,
    referralEarnings: 0.00001234,
    stakingRewards: 0.00005678,
    nextClaimIn: "45:23",
    level: "Silver",
    levelProgress: 65,
  }

  const recentActivity = [
    { type: "claim", amount: 0.00000123, time: "2 minutes ago" },
    { type: "referral", amount: 0.00000045, time: "1 hour ago" },
    { type: "staking", amount: 0.00000234, time: "3 hours ago" },
    { type: "multiply", amount: -0.000001, time: "5 hours ago" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-tronmax-green">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Balance</CardTitle>
              <Coins className="h-4 w-4 text-tronmax-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-tronmax-green">{stats.totalBalance.toFixed(8)}</div>
              <p className="text-xs text-gray-400">TRX</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Today's Claims</CardTitle>
              <Target className="h-4 w-4 text-tronmax-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-tronmax-green">{stats.todayClaims}</div>
              <p className="text-xs text-gray-400">out of 24</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Claims</CardTitle>
              <Activity className="h-4 w-4 text-tronmax-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-tronmax-green">{stats.totalClaims.toLocaleString()}</div>
              <p className="text-xs text-gray-400">lifetime</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Next Claim</CardTitle>
              <Calendar className="h-4 w-4 text-tronmax-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-tronmax-green">{stats.nextClaimIn}</div>
              <p className="text-xs text-gray-400">minutes</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Account Level */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-tronmax-green flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Account Level
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Current Level</span>
                <Badge className="bg-tronmax-green/20 text-tronmax-green border-tronmax-green">{stats.level}</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Progress to Gold</span>
                  <span className="text-tronmax-green">{stats.levelProgress}%</span>
                </div>
                <Progress value={stats.levelProgress} className="bg-gray-700" />
              </div>
            </CardContent>
          </Card>

          {/* Earnings Breakdown */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-tronmax-green flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Earnings Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Referral Earnings</span>
                <span className="text-tronmax-green font-semibold">{stats.referralEarnings.toFixed(8)} TRX</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Staking Rewards</span>
                <span className="text-tronmax-green font-semibold">{stats.stakingRewards.toFixed(8)} TRX</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Faucet Claims</span>
                <span className="text-tronmax-green font-semibold">
                  {(stats.totalBalance - stats.referralEarnings - stats.stakingRewards).toFixed(8)} TRX
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-tronmax-green flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest transactions and activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.type === "claim"
                          ? "bg-tronmax-green"
                          : activity.type === "referral"
                            ? "bg-blue-500"
                            : activity.type === "staking"
                              ? "bg-purple-500"
                              : "bg-red-500"
                      }`}
                    />
                    <span className="text-gray-300 capitalize">{activity.type}</span>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${activity.amount > 0 ? "text-tronmax-green" : "text-red-400"}`}>
                      {activity.amount > 0 ? "+" : ""}
                      {activity.amount.toFixed(8)} TRX
                    </div>
                    <div className="text-xs text-gray-400">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
