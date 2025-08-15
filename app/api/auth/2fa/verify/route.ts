import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../[...nextauth]/route"
import speakeasy from "speakeasy"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { token, secret, action } = await request.json()

    if (!token || !secret) {
      return NextResponse.json({ error: "Missing token or secret" }, { status: 400 })
    }

    // Verify the token
    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: "base32",
      token: token,
      window: 2, // Allow 2 time steps before/after current time
    })

    if (!verified) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 })
    }

    if (action === "enable") {
      // In production, save the secret to user's database record
      console.log(`2FA enabled for user: ${session.user.email}`)

      return NextResponse.json({
        success: true,
        message: "2FA has been successfully enabled",
      })
    } else if (action === "disable") {
      // In production, remove the secret from user's database record
      console.log(`2FA disabled for user: ${session.user.email}`)

      return NextResponse.json({
        success: true,
        message: "2FA has been successfully disabled",
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("2FA verification error:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
