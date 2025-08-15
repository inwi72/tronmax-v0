"use client"
import { useEffect, useState } from "react"

export function StatsSection() {
  // Target stats (in a real app, from API)
  const targetStats = {
    totalUsers: 123,
    totalClaims: 456,
    totalStaked: 7890.5,
  }

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalClaims: 0,
    totalStaked: 0,
  })

  // Count-up animation
  useEffect(() => {
    const duration = 2000 // ms
    const steps = 60
    const interval = duration / steps
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      setStats({
        totalUsers: Math.floor((targetStats.totalUsers / steps) * currentStep),
        totalClaims: Math.floor((targetStats.totalClaims / steps) * currentStep),
        totalStaked: parseFloat(((targetStats.totalStaked / steps) * currentStep).toFixed(1)),
      })

      if (currentStep >= steps) clearInterval(timer)
    }, interval)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="text-center py-10 text-gray-300 mb-8 bg-gray-900/40 rounded-xl shadow-lg border border-tronmax-green/30">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Registered Users */}
          <div className="p-6 rounded-lg bg-gray-800 hover:shadow-lg hover:shadow-tronmax-green/30 transition-all">
            <p className="text-sm opacity-80">Registered Users</p>
            <p className="text-3xl font-extrabold text-tronmax-green">{stats.totalUsers.toLocaleString()}</p>
          </div>

          {/* Total Claims */}
          <div className="p-6 rounded-lg bg-gray-800 hover:shadow-lg hover:shadow-tronmax-green/30 transition-all">
            <p className="text-sm opacity-80">Total Claims</p>
            <p className="text-3xl font-extrabold text-tronmax-green">{stats.totalClaims.toLocaleString()}</p>
          </div>

          {/* Total Staked */}
          <div className="p-6 rounded-lg bg-gray-800 hover:shadow-lg hover:shadow-tronmax-green/30 transition-all">
            <p className="text-sm opacity-80">Total Staked</p>
            <p className="text-3xl font-extrabold text-tronmax-green">{stats.totalStaked.toLocaleString()} TRX</p>
          </div>
        </div>
      </div>
    </section>
  )
}
