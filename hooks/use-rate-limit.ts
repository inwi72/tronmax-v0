"use client"

import { useState, useEffect } from "react"

interface RateLimitStatus {
  blocked: boolean
  limits: {
    faucet: { remaining: number; resetTime: number }
    multiply: { remaining: number; resetTime: number }
    withdrawal: { remaining: number; resetTime: number }
  }
}

export function useRateLimit() {
  const [status, setStatus] = useState<RateLimitStatus | null>(null)
  const [loading, setLoading] = useState(true)

  const checkRateLimit = async () => {
    try {
      const response = await fetch("/api/security/rate-limit")
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      console.error("Failed to check rate limits:", error)
    } finally {
      setLoading(false)
    }
  }

  const checkAction = async (action: string, userId?: string) => {
    try {
      const response = await fetch("/api/security/rate-limit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, userId }),
      })

      const data = await response.json()

      if (data.blocked) {
        throw new Error("IP blocked due to suspicious activity")
      }

      if (!data.allowed) {
        throw new Error(data.error || "Rate limit exceeded")
      }

      // Refresh status after successful action
      await checkRateLimit()

      return data
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    checkRateLimit()

    // Refresh rate limit status every 30 seconds
    const interval = setInterval(checkRateLimit, 30000)
    return () => clearInterval(interval)
  }, [])

  return {
    status,
    loading,
    checkAction,
    refresh: checkRateLimit,
  }
}
