import { type NextRequest, NextResponse } from "next/server"

// Mock database for email verification tokens
const verificationTokens = new Map()
const users = new Map()

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Verification token required" }, { status: 400 })
    }

    // Check if token exists and is valid
    const tokenData = verificationTokens.get(token)
    if (!tokenData) {
      return NextResponse.json({ error: "Invalid or expired verification token" }, { status: 400 })
    }

    // Check if token is expired (24 hours)
    const tokenAge = Date.now() - tokenData.createdAt
    if (tokenAge > 24 * 60 * 60 * 1000) {
      verificationTokens.delete(token)
      return NextResponse.json({ error: "Verification token expired" }, { status: 400 })
    }

    // Activate user account
    const user = users.get(tokenData.email)
    if (user) {
      user.emailVerified = true
      user.isActive = true
      users.set(tokenData.email, user)
    }

    // Remove used token
    verificationTokens.delete(token)

    return NextResponse.json({ message: "Email verified successfully" }, { status: 200 })
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")

  if (!token) {
    return new Response(
      `
      <html>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h2 style="color: #ff4444;">Invalid Verification Link</h2>
          <p>The verification link is invalid or missing.</p>
        </body>
      </html>
    `,
      {
        headers: { "Content-Type": "text/html" },
        status: 400,
      },
    )
  }

  // Verify token
  const tokenData = verificationTokens.get(token)
  if (!tokenData) {
    return new Response(
      `
      <html>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h2 style="color: #ff4444;">Invalid or Expired Link</h2>
          <p>This verification link is invalid or has expired.</p>
          <a href="/auth/register" style="color: #00ffd5;">Register Again</a>
        </body>
      </html>
    `,
      {
        headers: { "Content-Type": "text/html" },
        status: 400,
      },
    )
  }

  // Check expiration
  const tokenAge = Date.now() - tokenData.createdAt
  if (tokenAge > 24 * 60 * 60 * 1000) {
    verificationTokens.delete(token)
    return new Response(
      `
      <html>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h2 style="color: #ff4444;">Link Expired</h2>
          <p>This verification link has expired. Please register again.</p>
          <a href="/auth/register" style="color: #00ffd5;">Register Again</a>
        </body>
      </html>
    `,
      {
        headers: { "Content-Type": "text/html" },
        status: 400,
      },
    )
  }

  // Activate user
  const user = users.get(tokenData.email)
  if (user) {
    user.emailVerified = true
    user.isActive = true
    users.set(tokenData.email, user)
  }

  verificationTokens.delete(token)

  return new Response(
    `
    <html>
      <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #0a0a0a; color: white;">
        <div style="max-width: 500px; margin: 0 auto; padding: 40px; background: #1a1a1a; border-radius: 10px; border: 1px solid #00ffd5;">
          <h2 style="color: #00ffd5; margin-bottom: 20px;">✅ Email Verified Successfully!</h2>
          <p style="margin-bottom: 30px;">Your TronMax account has been activated. You can now login and start earning TRX!</p>
          <a href="/auth/login" style="display: inline-block; background: #00ffd5; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login to TronMax</a>
        </div>
      </body>
    </html>
  `,
    {
      headers: { "Content-Type": "text/html" },
      status: 200,
    },
  )
}
