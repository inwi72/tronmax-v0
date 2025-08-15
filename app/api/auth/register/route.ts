import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import { RateLimiterMemory } from "rate-limiter-flexible"

// Rate limiter for registration
const registerLimiter = new RateLimiterMemory({
  keyGenerator: (req: NextRequest) => req.ip || "unknown",
  points: 3, // Number of registrations
  duration: 3600, // Per hour
})

// Mock databases
const users = new Map()
const verificationTokens = new Map()

// Mock email service
async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/verify-email?token=${token}`

  console.log(`
    📧 VERIFICATION EMAIL for ${email}
    ═══════════════════════════════════════
    Subject: Verify Your TronMax Account
    
    Welcome to TronMax! 
    
    Please click the link below to verify your email address:
    ${verificationUrl}
    
    This link will expire in 24 hours.
    
    If you didn't create this account, please ignore this email.
    ═══════════════════════════════════════
  `)

  return true
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    await registerLimiter.consume(request.ip || "unknown")

    const { email, password, name } = await request.json()

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    if (users.has(email)) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    const newUser = {
      id: Date.now().toString(),
      email,
      name,
      password: hashedPassword,
      balance: 0,
      walletAddress: null,
      twoFactorEnabled: false,
      twoFactorSecret: null,
      role: "user",
      emailVerified: false, // Email not verified initially
      isActive: false, // Account not active until email verified
      createdAt: new Date().toISOString(),
    }

    users.set(email, newUser)

    const verificationToken = crypto.randomBytes(32).toString("hex")
    verificationTokens.set(verificationToken, {
      email,
      createdAt: Date.now(),
    })

    await sendVerificationEmail(email, verificationToken)

    // Log registration for audit
    console.log(`New user registered: ${email} from IP: ${request.ip} - Email verification required`)

    return NextResponse.json(
      {
        message: "Registration successful! Please check your email to verify your account.",
        requiresVerification: true,
      },
      { status: 201 },
    )
  } catch (error) {
    if (error.remainingPoints !== undefined) {
      return NextResponse.json({ error: "Too many registration attempts. Try again later." }, { status: 429 })
    }

    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
