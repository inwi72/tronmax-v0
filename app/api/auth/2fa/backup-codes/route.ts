import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../[...nextauth]/route"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { code, action } = await request.json()

    if (action === "verify") {
      // In production, check if backup code exists and hasn't been used
      // For demo, we'll accept any 6-character uppercase code
      const isValidBackupCode = /^[A-Z0-9]{6}$/.test(code)

      if (isValidBackupCode) {
        console.log(`Backup code used for user: ${session.user.email}`)
        return NextResponse.json({ success: true })
      } else {
        return NextResponse.json({ error: "Invalid backup code" }, { status: 400 })
      }
    } else if (action === "regenerate") {
      // Generate new backup codes
      const newBackupCodes = Array.from({ length: 8 }, () => Math.random().toString(36).substring(2, 8).toUpperCase())

      console.log(`Backup codes regenerated for user: ${session.user.email}`)

      return NextResponse.json({
        backupCodes: newBackupCodes,
        message: "New backup codes generated",
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Backup codes error:", error)
    return NextResponse.json({ error: "Operation failed" }, { status: 500 })
  }
}
