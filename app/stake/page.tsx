"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Coins, TrendingUp, Clock, Shield, Zap, Star } from "lucide-react"

export default function StakePage() {
  const [balance] = useState(0.1)
  const [stakeAmount, setStakeAmount] = useState(0.01)
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null)

  const stakingPlans = [
    {
      id: 1,
      name: "Starter",
      minAmount: 0.01,
      maxAmount: 0.1,
      dailyReturn: 1.5,
      duration: 30,
      totalReturn: 145,
      icon: <Zap className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-500",
      popular: false,
    },
    {
      id: 2,
      name: "Growth",
      minAmount: 0.1,
      maxAmount: 1.0,
      dailyReturn: 2.0,
      duration: 45,
      totalReturn: 190,
      icon: <TrendingUp className="w-8 h-8" />,
      color: "from-green-500 to-emerald-500",
      popular: true,
    },
    {
      id: 3,
      name: "Premium",
      minAmount: 1.0,
      maxAmount: 10.0,
      dailyReturn: 2.5,
      duration: 60,
      totalReturn: 250,
      icon: <Star className="w-8 h-8" />,
      color: "from-purple-500 to-pink-500",
      popular: false,
    },
    {
      id: 4,
      name: "Elite",
      minAmount: 10.0,
      maxAmount: 100.0,
      dailyReturn: 3.0,
      duration: 90,
      totalReturn: 370,
      icon: <Shield className="w-8 h-8" />,
      color: "from-yellow-500 to-orange-500",
      popular: false,
    },
  ]

  const activeStakes = [
    {
      id: 1,
      plan: "Growth",
      amount: 0.5,
      dailyReturn: 0.01,
      daysLeft: 32,
      totalEarned: 0.13,
      status: "active",
    },
    {
      id: 2,
      plan: "Starter",
      amount: 0.05,
      dailyReturn: 0.00075,
      daysLeft: 15,
      totalEarned: 0.01125,
      status: "active",
    },
  ]

  const handleStake = (planId: number) => {
    const plan = stakingPlans.find((p) => p.id === planId)
    if (!plan || stakeAmount < plan.minAmount || stakeAmount > plan.maxAmount || stakeAmount > balance) {
      return
    }
    // Handle staking logic here
    console.log(`Staking ${stakeAmount} TRX in ${plan.name} plan`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
              TRX Staking
            </h1>
            <p className="text-gray-300">Stake your TRX and earn daily returns</p>
          </div>
          <Badge variant="outline" className="bg-cyan-500/10 border-cyan-500 text-cyan-400 px-4 py-2 text-lg">
            <Coins className="w-5 h-5 mr-2" />
            Balance: {balance.toFixed(6)} TRX
          </Badge>
        </div>

        <Tabs defaultValue="plans" className="space-y-6">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="plans" className="data-[state=active]:bg-cyan-500">
              Staking Plans
            </TabsTrigger>
            <TabsTrigger value="active" className="data-[state=active]:bg-cyan-500">
              My Stakes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="plans" className="space-y-6">
            {/* Staking Amount Input */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg">Stake Amount</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(Number(e.target.value))}
                    step="0.01"
                    min="0.01"
                    max={balance}
                    className="bg-gray-700 border-gray-600 text-white flex-1"
                    placeholder="Enter amount to stake"
                  />
                  <Button
                    onClick={() => setStakeAmount(balance)}
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                  >
                    Max
                  </Button>
                </div>
                <div className="text-sm text-gray-400">Available balance: {balance.toFixed(6)} TRX</div>
              </CardContent>
            </Card>

            {/* Staking Plans */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stakingPlans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`bg-gray-800/50 border-gray-700 relative overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105 ${
                    selectedPlan === plan.id ? "ring-2 ring-cyan-500" : ""
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-3 py-1 text-xs font-bold">
                      POPULAR
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <div
                      className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center text-white mb-3`}
                    >
                      {plan.icon}
                    </div>
                    <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400">{plan.dailyReturn}%</div>
                      <div className="text-sm text-gray-400">Daily Return</div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Min Amount:</span>
                        <span className="text-white">{plan.minAmount} TRX</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Max Amount:</span>
                        <span className="text-white">{plan.maxAmount} TRX</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Duration:</span>
                        <span className="text-white">{plan.duration} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Return:</span>
                        <span className="text-green-400 font-bold">{plan.totalReturn}%</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleStake(plan.id)}
                      disabled={stakeAmount < plan.minAmount || stakeAmount > plan.maxAmount || stakeAmount > balance}
                      className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 text-white font-bold py-2`}
                    >
                      Stake Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Benefits */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg">Staking Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="w-6 h-6 text-green-400" />
                    </div>
                    <h4 className="font-semibold text-green-400 mb-2">Daily Returns</h4>
                    <p className="text-gray-300 text-sm">Earn daily returns on your staked TRX automatically</p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Shield className="w-6 h-6 text-blue-400" />
                    </div>
                    <h4 className="font-semibold text-blue-400 mb-2">Secure</h4>
                    <p className="text-gray-300 text-sm">Your funds are secured by smart contracts on TRON</p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Clock className="w-6 h-6 text-purple-400" />
                    </div>
                    <h4 className="font-semibold text-purple-400 mb-2">Flexible</h4>
                    <p className="text-gray-300 text-sm">Choose from multiple plans with different durations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active">
            <div className="space-y-4">
              {activeStakes.length > 0 ? (
                activeStakes.map((stake) => (
                  <Card key={stake.id} className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">{stake.plan} Plan</h4>
                            <p className="text-gray-400 text-sm">Staked: {stake.amount} TRX</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-green-400 font-bold">+{stake.totalEarned.toFixed(6)} TRX</div>
                          <div className="text-gray-400 text-sm">Total Earned</div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-gray-400">Daily Return</div>
                          <div className="text-white font-semibold">+{stake.dailyReturn.toFixed(6)} TRX</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Days Left</div>
                          <div className="text-white font-semibold">{stake.daysLeft} days</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Status</div>
                          <Badge variant="default" className="bg-green-500">
                            {stake.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Coins className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">No Active Stakes</h3>
                    <p className="text-gray-400 mb-4">Start staking your TRX to earn daily returns</p>
                    <Button
                      onClick={() => {
                        const tabsList = document.querySelector('[role="tablist"]')
                        const plansTab = tabsList?.querySelector('[value="plans"]') as HTMLElement
                        plansTab?.click()
                      }}
                      className="bg-cyan-500 hover:bg-cyan-600 text-white"
                    >
                      View Staking Plans
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
