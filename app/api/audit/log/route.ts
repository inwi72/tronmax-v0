import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"

// Audit log levels
export enum AuditLevel {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical",
}

// Audit event types
export enum AuditEventType {
  LOGIN_SUCCESS = "login_success",
  LOGIN_FAILED = "login_failed",
  LOGOUT = "logout",
  REGISTER = "register",
  PASSWORD_CHANGE = "password_change",
  TWO_FA_ENABLED = "2fa_enabled",
  TWO_FA_DISABLED = "2fa_disabled",
  TWO_FA_FAILED = "2fa_failed",
  FAUCET_CLAIM = "faucet_claim",
  WITHDRAWAL_REQUEST = "withdrawal_request",
  WITHDRAWAL_APPROVED = "withdrawal_approved",
  WITHDRAWAL_REJECTED = "withdrawal_rejected",
  MULTIPLY_GAME = "multiply_game",
  REFERRAL_EARNED = "referral_earned",
  RATE_LIMIT_EXCEEDED = "rate_limit_exceeded",
  IP_BLOCKED = "ip_blocked",
  SUSPICIOUS_ACTIVITY = "suspicious_activity",
  ADMIN_ACTION = "admin_action",
}

interface AuditLogEntry {
  id: string
  timestamp: string
  userId?: string
  userEmail?: string
  ipAddress: string
  userAgent: string
  eventType: AuditEventType
  level: AuditLevel
  message: string
  details?: Record<string, any>
  sessionId?: string
}

// In-memory storage for demo (use database in production)
global.auditLogs = global.auditLogs || []

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { eventType, level = AuditLevel.INFO, message, details = {}, userId, userEmail } = await request.json()

    if (!eventType || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const auditEntry: AuditLogEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      userId: userId || session?.user?.id,
      userEmail: userEmail || session?.user?.email,
      ipAddress: request.ip || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
      eventType,
      level,
      message,
      details,
      sessionId: session?.user?.id ? `session_${session.user.id}_${Date.now()}` : undefined,
    }

    // Store audit log (in production, use database)
    global.auditLogs.push(auditEntry)

    // Keep only last 10000 entries to prevent memory issues
    if (global.auditLogs.length > 10000) {
      global.auditLogs = global.auditLogs.slice(-10000)
    }

    // Log to console for immediate visibility
    console.log(`[AUDIT] ${level.toUpperCase()}: ${message}`, {
      user: userEmail || userId || "anonymous",
      ip: auditEntry.ipAddress,
      event: eventType,
      details,
    })

    // Send alerts for critical events
    if (level === AuditLevel.CRITICAL) {
      console.error(`[CRITICAL AUDIT EVENT] ${message}`, auditEntry)
      // In production, send email/SMS alerts here
    }

    return NextResponse.json({ success: true, logId: auditEntry.id })
  } catch (error) {
    console.error("Audit logging error:", error)
    return NextResponse.json({ error: "Failed to log audit event" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Only allow admins to view audit logs
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(request.url)
    const page = Number.parseInt(url.searchParams.get("page") || "1")
    const limit = Number.parseInt(url.searchParams.get("limit") || "50")
    const level = url.searchParams.get("level")
    const eventType = url.searchParams.get("eventType")
    const userId = url.searchParams.get("userId")
    const startDate = url.searchParams.get("startDate")
    const endDate = url.searchParams.get("endDate")

    let filteredLogs = [...(global.auditLogs || [])]

    // Apply filters
    if (level) {
      filteredLogs = filteredLogs.filter((log) => log.level === level)
    }
    if (eventType) {
      filteredLogs = filteredLogs.filter((log) => log.eventType === eventType)
    }
    if (userId) {
      filteredLogs = filteredLogs.filter((log) => log.userId === userId)
    }
    if (startDate) {
      filteredLogs = filteredLogs.filter((log) => new Date(log.timestamp) >= new Date(startDate))
    }
    if (endDate) {
      filteredLogs = filteredLogs.filter((log) => new Date(log.timestamp) <= new Date(endDate))
    }

    // Sort by timestamp (newest first)
    filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedLogs = filteredLogs.slice(startIndex, endIndex)

    return NextResponse.json({
      logs: paginatedLogs,
      pagination: {
        page,
        limit,
        total: filteredLogs.length,
        pages: Math.ceil(filteredLogs.length / limit),
      },
      filters: {
        level,
        eventType,
        userId,
        startDate,
        endDate,
      },
    })
  } catch (error) {
    console.error("Audit log retrieval error:", error)
    return NextResponse.json({ error: "Failed to retrieve audit logs" }, { status: 500 })
  }
}
