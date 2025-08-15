"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Users, Coins, Gift, Trophy, Target, Activity, Award, Star, Crown } from "lucide-react"

export default function StatsPage() {
  // Mock user stats
  const userStats = {
    totalClaims: 156,
    totalEarned: 0.234,
    gamesPlayed: 89,
    gamesWon: 45,
    winRate: 50.6,
    referrals: 25,
    referralEarnings: 0.125,
    daysActive: 23,
    currentStreak: 7,
    longestStreak: 12,
  }

  // Mock platform stats
  const platformStats = {
    totalUsers: 45678,
    totalPaid: 1234567.89,
    todayClaims: 8901,
    activeUsers: 12345,
  }

  // Mock chart data
  const dailyEarnings = [
    { day: "Mon", earnings: 0.012 },
    { day: "Tue", earnings: 0.018 },
    { day: "Wed", earnings: 0.015 },
    { day: "Thu", earnings: 0.022 },
    { day: "Fri", earnings: 0.019 },
    { day: "Sat", earnings: 0.025 },
    { day: "Sun", earnings: 0.021 },
  ]

  const monthlyActivity = [
    { month: "Jan", claims: 45, games: 23 },
    { month: "Feb", claims: 52, games: 31 },
    { month: "Mar", claims: 38, games: 19 },
    { month: "Apr", claims: 61, games: 35 },
  ]

  const earningsBreakdown = [
    { name: "Faucet Claims", value: 65, color: "#06b6d4" },
    { name: "Game Winnings", value: 25, color: "#10b981" },
    { name: "Referral Bonus", value: 10, color: "#f59e0b" },
  ]

  // Mock leaderboard
  const leaderboard = [
    { rank: 1, username: "CryptoKing***", earnings: 2.456, badge: "crown" },
    { rank: 2, username: "TronMaster***", earnings: 2.123, badge: "gold" },
    { rank: 3, username: "BlockChain***", earnings: 1.987, badge: "silver" },
    { rank: 4, username: "DigitalGold***", earnings: 1.654, badge: "bronze" },
    { rank: 5, username: "CoinHunter***", earnings: 1.432, badge: "none" },
    { rank: 12, username: "You", earnings: 0.234, badge: "none", isUser: true },
  ]

  // Mock achievements
  const achievements = [
    { id: 1, name: "First Claim", description: "Make your first faucet claim", completed: true, icon: "🎯" },
    { id: 2, name: "Lucky Seven", description: "Claim 7 days in a row", completed: true, icon: "🍀" },
    { id: 3, name: "Game Master", description: "Win 50 multiply games", completed: false, progress: 45, icon: "🎮" },
    { id: 4, name: "Referral Pro", description: "Refer 50 users", completed: false, progress: 25, icon: "👥" },
    {
      id: 5,
      name: "High Roller",
      description: "Win 1 TRX in a single game",
      completed: false,
      progress: 0,
      icon: "💎",
    },
    { id: 6, name: "Consistent", description: "Claim 30 days in a row", completed: false, progress: 23, icon: "📅" },
  ]

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case "crown":
        return <Crown className="w-5 h-5 text-yellow-400" />
      case "gold":
        return <Trophy className="w-5 h-5 text-yellow-400" />
      case "silver":
        return <Award className="w-5 h-5 text-gray-400" />
      case "bronze":
        return <Star className="w-5 h-5 text-orange-400" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
            Statistics Dashboard
          </h1>
          <p className="text-gray-300">Track your progress and compare with other users</p>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="personal" className="data-[state=active]:bg-cyan-500">
              Personal Stats
            </TabsTrigger>
            <TabsTrigger value="platform" className="data-[state=active]:bg-cyan-500">
              Platform Stats
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-cyan-500">
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-cyan-500">
              Achievements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            {/* Personal Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4 text-center">
                  <Gift className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-cyan-400">{userStats.totalClaims}</div>
                  <div className="text-sm text-gray-400">Total Claims</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4 text-center">
                  <Coins className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-400">{userStats.totalEarned.toFixed(6)}</div>
                  <div className="text-sm text-gray-400">Total Earned (TRX)</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4 text-center">
                  <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-400">{userStats.winRate}%</div>
                  <div className="text-sm text-gray-400">Win Rate</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4 text-center">
                  <Activity className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-400">{userStats.currentStreak}</div>
                  <div className="text-sm text-gray-400">Current Streak</div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Earnings Chart */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg">Daily Earnings (Last 7 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={dailyEarnings}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="day" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="earnings" fill="#06b6d4" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Earnings Breakdown */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg">Earnings Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={earningsBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {earningsBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {earningsBreakdown.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <span className="text-sm text-gray-300">{item.name}</span>
                        </div>
                        <span className="text-sm font-semibold text-white">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Activity */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg">Monthly Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyActivity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                    <Line type="monotone" dataKey="claims" stroke="#06b6d4" strokeWidth={2} />
                    <Line type="monotone" dataKey="games" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="platform">
            {/* Platform Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-400">{platformStats.totalUsers.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Total Users</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4 text-center">
                  <Coins className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-400">{platformStats.totalPaid.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Total Paid (TRX)</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4 text-center">
                  <Gift className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-cyan-400">{platformStats.todayClaims.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Today's Claims</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4 text-center">
                  <Activity className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-400">{platformStats.activeUsers.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Active Users</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="leaderboard">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                  Top Earners (This Month)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.map((user) => (
                    <div
                      key={user.rank}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        user.isUser ? "bg-cyan-500/10 border-cyan-500/30" : "bg-gray-700/30 border-gray-600"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                              user.rank <= 3 ? "bg-gradient-to-r from-yellow-400 to-yellow-600" : "bg-gray-600"
                            }`}
                          >
                            {user.rank}
                          </div>
                          {getBadgeIcon(user.badge)}
                        </div>
                        <div>
                          <div className={`font-semibold ${user.isUser ? "text-cyan-400" : "text-white"}`}>
                            {user.username}
                          </div>
                          {user.isUser && (
                            <Badge variant="outline" className="text-xs mt-1">
                              You
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-400">{user.earnings.toFixed(6)} TRX</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <Card
                  key={achievement.id}
                  className={`border-gray-700 ${
                    achievement.completed ? "bg-green-500/10 border-green-500/30" : "bg-gray-800/50"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div>
                          <h4 className={`font-semibold ${achievement.completed ? "text-green-400" : "text-white"}`}>
                            {achievement.name}
                          </h4>
                          <p className="text-sm text-gray-400">{achievement.description}</p>
                        </div>
                      </div>
                      {achievement.completed && <Badge className="bg-green-500 text-white">Completed</Badge>}
                    </div>
                    {!achievement.completed && achievement.progress !== undefined && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-white">
                            {achievement.progress}/
                            {achievement.name === "Game Master"
                              ? 50
                              : achievement.name === "Referral Pro"
                                ? 50
                                : achievement.name === "Consistent"
                                  ? 30
                                  : 1}
                          </span>
                        </div>
                        <Progress
                          value={
                            (achievement.progress /
                              (achievement.name === "Game Master"
                                ? 50
                                : achievement.name === "Referral Pro"
                                  ? 50
                                  : achievement.name === "Consistent"
                                    ? 30
                                    : 1)) *
                            100
                          }
                          className="h-2"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
