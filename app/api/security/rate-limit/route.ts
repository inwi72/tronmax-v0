import { type NextRequest, NextResponse } from "next/server"
import { RateLimiterMemory } from "rate-limiter-flexible"

// Different rate limiters for different actions
const faucetClaimLimiter = new RateLimiterMemory({
  keyGenerator: (req: NextRequest) => req.ip || "unknown",
  points: 1, // 1 claim
  duration: 3600, // Per hour
})

const multiplyGameLimiter = new RateLimiterMemory({
  keyGenerator: (req: NextRequest) => req.ip || "unknown",
  points: 100, // 100 games
  duration: 3600, // Per hour
})

const withdrawalLimiter = new RateLimiterMemory({
  keyGenerator: (req: NextRequest) => req.ip || "unknown",
  points: 3, // 3 withdrawals
  duration: 86400, // Per day
})

// Suspicious activity tracker
const suspiciousActivityLimiter = new RateLimiterMemory({
  keyGenerator: (req: NextRequest) => req.ip || "unknown",
  points: 50, // 50 suspicious actions
  duration: 3600, // Per hour - if exceeded, IP gets blocked
})

// IP blocking store (in production, use Redis or database)
global.blockedIPs = global.blockedIPs || new Set()

export async function POST(request: NextRequest) {
  try {
    const { action, userId } = await request.json()
    const clientIP = request.ip || "unknown"

    // Check if IP is blocked
    if (global.blockedIPs.has(clientIP)) {
      return NextResponse.json(
        {
          error: "IP blocked due to suspicious activity",
          blocked: true,
        },
        { status: 403 },
      )
    }

    let limiter: RateLimiterMemory
    let actionName: string

    switch (action) {
      case "faucet_claim":
        limiter = faucetClaimLimiter
        actionName = "Faucet Claim"
        break
      case "multiply_game":
        limiter = multiplyGameLimiter
        actionName = "Multiply Game"
        break
      case "withdrawal":
        limiter = withdrawalLimiter
        actionName = "Withdrawal"
        break
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    try {
      await limiter.consume(clientIP)

      // Log successful rate limit check
      console.log(`Rate limit check passed for ${actionName} from IP: ${clientIP}, User: ${userId}`)

      return NextResponse.json({
        allowed: true,
        remaining: await limiter.get(clientIP).then((res) => res?.remainingPoints || 0),
      })
    } catch (rateLimitError) {
      // Rate limit exceeded
      console.warn(`Rate limit exceeded for ${actionName} from IP: ${clientIP}, User: ${userId}`)

      // Track suspicious activity
      try {
        await suspiciousActivityLimiter.consume(clientIP)
      } catch (suspiciousError) {
        // Too many rate limit violations - block IP
        global.blockedIPs.add(clientIP)
        console.error(`IP ${clientIP} blocked due to excessive rate limit violations`)

        return NextResponse.json(
          {
            error: "IP blocked due to suspicious activity",
            blocked: true,
          },
          { status: 403 },
        )
      }

      return NextResponse.json(
        {
          error: `Rate limit exceeded for ${actionName}`,
          allowed: false,
          retryAfter: rateLimitError.msBeforeNext,
        },
        { status: 429 },
      )
    }
  } catch (error) {
    console.error("Rate limit check error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Endpoint to check current rate limit status
export async function GET(request: NextRequest) {
  try {
    const clientIP = request.ip || "unknown"

    if (global.blockedIPs.has(clientIP)) {
      return NextResponse.json({ blocked: true })
    }

    const faucetStatus = await faucetClaimLimiter.get(clientIP)
    const multiplyStatus = await multiplyGameLimiter.get(clientIP)
    const withdrawalStatus = await withdrawalLimiter.get(clientIP)

    return NextResponse.json({
      blocked: false,
      limits: {
        faucet: {
          remaining: faucetStatus?.remainingPoints || 1,
          resetTime: faucetStatus?.msBeforeNext || 0,
        },
        multiply: {
          remaining: multiplyStatus?.remainingPoints || 100,
          resetTime: multiplyStatus?.msBeforeNext || 0,
        },
        withdrawal: {
          remaining: withdrawalStatus?.remainingPoints || 3,
          resetTime: withdrawalStatus?.msBeforeNext || 0,
        },
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
