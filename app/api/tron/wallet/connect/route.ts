import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../auth/[...nextauth]/route"
import { auditLogger } from "@/utils/audit-logger"

// TRON address validation
function isValidTronAddress(address: string): boolean {
  // Basic TRON address validation (starts with T and is 34 characters)
  const tronAddressRegex = /^T[A-Za-z1-9]{33}$/
  return tronAddressRegex.test(address)
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { walletAddress, signature } = await request.json()

    if (!walletAddress || !signature) {
      return NextResponse.json({ error: "Missing wallet address or signature" }, { status: 400 })
    }

    // Validate TRON address format
    if (!isValidTronAddress(walletAddress)) {
      return NextResponse.json({ error: "Invalid TRON address format" }, { status: 400 })
    }

    // In production, verify the signature to ensure the user owns the wallet
    // For demo purposes, we'll accept any valid address format

    // Store wallet connection (in production, save to database)
    console.log(`Wallet connected: ${walletAddress} for user: ${session.user.email}`)

    // Log audit event
    await auditLogger.loginSuccess(session.user.email!, session.user.id!, { walletAddress, action: "wallet_connected" })

    return NextResponse.json({
      success: true,
      message: "Wallet connected successfully",
      walletAddress,
    })
  } catch (error) {
    console.error("Wallet connection error:", error)
    return NextResponse.json({ error: "Failed to connect wallet" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // In production, fetch from database
    // For demo, return mock data
    const mockWalletData = {
      connected: true,
      address: "TLyqzVGLV1srkB7dToTAEqgDSfPtXRJZYH",
      balance: 1250.75,
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json(mockWalletData)
  } catch (error) {
    console.error("Wallet status error:", error)
    return NextResponse.json({ error: "Failed to get wallet status" }, { status: 500 })
  }
}
