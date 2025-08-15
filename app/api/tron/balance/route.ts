import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"

// Mock TRON API call (replace with actual TRON API integration)
async function getTronBalance(address: string): Promise<number> {
  try {
    // In production, use TronWeb or TRON API
    // const tronWeb = new TronWeb({
    //   fullHost: 'https://api.trongrid.io',
    // });
    // const balance = await tronWeb.trx.getBalance(address);
    // return balance / 1000000; // Convert from SUN to TRX

    // Mock balance for demo
    return Math.random() * 1000 + 100
  } catch (error) {
    console.error("Error fetching TRON balance:", error)
    throw new Error("Failed to fetch balance")
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(request.url)
    const address = url.searchParams.get("address")

    if (!address) {
      return NextResponse.json({ error: "Address parameter required" }, { status: 400 })
    }

    const balance = await getTronBalance(address)

    return NextResponse.json({
      address,
      balance,
      currency: "TRX",
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Balance check error:", error)
    return NextResponse.json({ error: "Failed to check balance" }, { status: 500 })
  }
}
