import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

// Mock email service - replace with real email service like SendGrid, Resend, etc.
async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/verify-email?token=${token}`

  // In production, replace this with actual email sending
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

  return true // Return success for mock
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Generate verification token
    const token = crypto.randomBytes(32).toString("hex")

    // Store token (in production, use database)
    const verificationTokens = new Map()
    verificationTokens.set(token, {
      email,
      createdAt: Date.now(),
    })

    // Send verification email
    await sendVerificationEmail(email, token)

    return NextResponse.json(
      {
        message: "Verification email sent successfully",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Send verification error:", error)
    return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 })
  }
}
