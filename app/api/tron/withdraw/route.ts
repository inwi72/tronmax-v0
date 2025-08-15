import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { auditLogger } from "@/utils/audit-logger"

interface WithdrawalRequest {
  id: string
  userId: string
  userEmail: string
  amount: number
  toAddress: string
  status: "pending" | "approved" | "rejected" | "completed"
  requestedAt: string
  processedAt?: string
  txHash?: string
  adminNotes?: string
}

// In-memory storage for demo (use database in production)
global.withdrawalRequests = global.withdrawalRequests || []

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { amount, toAddress } = await request.json()

    // Validation
    if (!amount || !toAddress) {
      return NextResponse.json({ error: "Amount and address are required" }, { status: 400 })
    }

    if (amount < 10) {
      return NextResponse.json({ error: "Minimum withdrawal amount is 10 TRX" }, { status: 400 })
    }

    if (amount > 10000) {
      return NextResponse.json({ error: "Maximum withdrawal amount is 10,000 TRX" }, { status: 400 })
    }

    // TRON address validation
    const tronAddressRegex = /^T[A-Za-z1-9]{33}$/
    if (!tronAddressRegex.test(toAddress)) {
      return NextResponse.json({ error: "Invalid TRON address" }, { status: 400 })
    }

    // Check user balance (mock check)
    const userBalance = 1000 // In production, fetch from database
    if (amount > userBalance) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
    }

    // Create withdrawal request
    const withdrawalRequest: WithdrawalRequest = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      userId: session.user.id!,
      userEmail: session.user.email!,
      amount,
      toAddress,
      status: "pending",
      requestedAt: new Date().toISOString(),
    }

    global.withdrawalRequests.push(withdrawalRequest)

    // Log audit event
    await auditLogger.withdrawalRequest(session.user.email!, session.user.id!, amount, toAddress)

    // In production, notify admins via email/webhook
    console.log(`New withdrawal request: ${withdrawalRequest.id} - ${amount} TRX to ${toAddress}`)

    return NextResponse.json({
      success: true,
      message: "Withdrawal request submitted for manual approval",
      requestId: withdrawalRequest.id,
      estimatedProcessingTime: "24-48 hours",
    })
  } catch (error) {
    console.error("Withdrawal request error:", error)
    return NextResponse.json({ error: "Failed to process withdrawal request" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(request.url)
    const isAdmin = session.user.role === "admin"

    let withdrawals: WithdrawalRequest[]

    if (isAdmin) {
      // Admins can see all withdrawal requests
      withdrawals = global.withdrawalRequests || []
    } else {
      // Users can only see their own requests
      withdrawals = (global.withdrawalRequests || []).filter((req) => req.userId === session.user.id)
    }

    // Sort by request date (newest first)
    withdrawals.sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime())

    return NextResponse.json({
      withdrawals,
      isAdmin,
    })
  } catch (error) {
    console.error("Withdrawal history error:", error)
    return NextResponse.json({ error: "Failed to fetch withdrawal history" }, { status: 500 })
  }
}

// Admin endpoint to approve/reject withdrawals
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const { requestId, action, adminNotes, txHash } = await request.json()

    if (!requestId || !action) {
      return NextResponse.json({ error: "Request ID and action are required" }, { status: 400 })
    }

    const withdrawalIndex = (global.withdrawalRequests || []).findIndex((req) => req.id === requestId)

    if (withdrawalIndex === -1) {
      return NextResponse.json({ error: "Withdrawal request not found" }, { status: 404 })
    }

    const withdrawal = global.withdrawalRequests[withdrawalIndex]

    if (withdrawal.status !== "pending") {
      return NextResponse.json({ error: "Withdrawal request already processed" }, { status: 400 })
    }

    // Update withdrawal status
    withdrawal.status = action
    withdrawal.processedAt = new Date().toISOString()
    withdrawal.adminNotes = adminNotes
    if (txHash) {
      withdrawal.txHash = txHash
    }

    global.withdrawalRequests[withdrawalIndex] = withdrawal

    // Log audit event
    await auditLogger.logAuditEvent({
      eventType: action === "approved" ? "withdrawal_approved" : "withdrawal_rejected",
      message: `Withdrawal request ${requestId} ${action} by admin ${session.user.email}`,
      level: "info",
      details: { requestId, action, adminNotes, txHash, amount: withdrawal.amount },
      userId: session.user.id,
      userEmail: session.user.email,
    })

    console.log(`Withdrawal ${requestId} ${action} by admin ${session.user.email}`)

    return NextResponse.json({
      success: true,
      message: `Withdrawal request ${action} successfully`,
      withdrawal,
    })
  } catch (error) {
    console.error("Withdrawal processing error:", error)
    return NextResponse.json({ error: "Failed to process withdrawal" }, { status: 500 })
  }
}
