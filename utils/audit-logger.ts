import { AuditEventType, AuditLevel } from "@/app/api/audit/log/route"

interface LogAuditEventParams {
  eventType: AuditEventType
  message: string
  level?: AuditLevel
  details?: Record<string, any>
  userId?: string
  userEmail?: string
}

export async function logAuditEvent({
  eventType,
  message,
  level = AuditLevel.INFO,
  details = {},
  userId,
  userEmail,
}: LogAuditEventParams) {
  try {
    const response = await fetch("/api/audit/log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventType,
        message,
        level,
        details,
        userId,
        userEmail,
      }),
    })

    if (!response.ok) {
      console.error("Failed to log audit event:", await response.text())
    }

    return response.ok
  } catch (error) {
    console.error("Audit logging error:", error)
    return false
  }
}

// Convenience functions for common audit events
export const auditLogger = {
  loginSuccess: (userEmail: string, userId: string, details?: Record<string, any>) =>
    logAuditEvent({
      eventType: AuditEventType.LOGIN_SUCCESS,
      message: `User ${userEmail} logged in successfully`,
      level: AuditLevel.INFO,
      details,
      userId,
      userEmail,
    }),

  loginFailed: (email: string, reason: string, details?: Record<string, any>) =>
    logAuditEvent({
      eventType: AuditEventType.LOGIN_FAILED,
      message: `Login failed for ${email}: ${reason}`,
      level: AuditLevel.WARNING,
      details: { ...details, reason },
      userEmail: email,
    }),

  logout: (userEmail: string, userId: string) =>
    logAuditEvent({
      eventType: AuditEventType.LOGOUT,
      message: `User ${userEmail} logged out`,
      level: AuditLevel.INFO,
      userId,
      userEmail,
    }),

  register: (userEmail: string, userId: string) =>
    logAuditEvent({
      eventType: AuditEventType.REGISTER,
      message: `New user registered: ${userEmail}`,
      level: AuditLevel.INFO,
      userId,
      userEmail,
    }),

  twoFactorEnabled: (userEmail: string, userId: string) =>
    logAuditEvent({
      eventType: AuditEventType.TWO_FA_ENABLED,
      message: `2FA enabled for user ${userEmail}`,
      level: AuditLevel.INFO,
      userId,
      userEmail,
    }),

  twoFactorDisabled: (userEmail: string, userId: string) =>
    logAuditEvent({
      eventType: AuditEventType.TWO_FA_DISABLED,
      message: `2FA disabled for user ${userEmail}`,
      level: AuditLevel.WARNING,
      userId,
      userEmail,
    }),

  faucetClaim: (userEmail: string, userId: string, amount: number) =>
    logAuditEvent({
      eventType: AuditEventType.FAUCET_CLAIM,
      message: `User ${userEmail} claimed ${amount} TRX from faucet`,
      level: AuditLevel.INFO,
      details: { amount },
      userId,
      userEmail,
    }),

  withdrawalRequest: (userEmail: string, userId: string, amount: number, address: string) =>
    logAuditEvent({
      eventType: AuditEventType.WITHDRAWAL_REQUEST,
      message: `User ${userEmail} requested withdrawal of ${amount} TRX to ${address}`,
      level: AuditLevel.INFO,
      details: { amount, address },
      userId,
      userEmail,
    }),

  suspiciousActivity: (userEmail: string, userId: string, activity: string, details?: Record<string, any>) =>
    logAuditEvent({
      eventType: AuditEventType.SUSPICIOUS_ACTIVITY,
      message: `Suspicious activity detected for user ${userEmail}: ${activity}`,
      level: AuditLevel.CRITICAL,
      details,
      userId,
      userEmail,
    }),

  rateLimitExceeded: (userEmail: string, userId: string, action: string) =>
    logAuditEvent({
      eventType: AuditEventType.RATE_LIMIT_EXCEEDED,
      message: `Rate limit exceeded for user ${userEmail} on action: ${action}`,
      level: AuditLevel.WARNING,
      details: { action },
      userId,
      userEmail,
    }),

  ipBlocked: (ipAddress: string, reason: string) =>
    logAuditEvent({
      eventType: AuditEventType.IP_BLOCKED,
      message: `IP address ${ipAddress} blocked: ${reason}`,
      level: AuditLevel.CRITICAL,
      details: { ipAddress, reason },
    }),
}
