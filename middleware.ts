import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Add security headers
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("X-XSS-Protection", "1; mode=block")

  const adminPaths = ["/admin"]
  const isAdminPath = adminPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  if (isAdminPath) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    // Check if user has admin role
    if (token.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  // Check if path requires authentication
  const protectedPaths = [
    "/faucet",
    "/multiply",
    "/referrals",
    "/stats",
    "/stake",
    "/profile",
    "/dashboard",
    "/deposit",
  ]

  const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  if (isProtectedPath) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    "/faucet/:path*",
    "/multiply/:path*",
    "/referrals/:path*",
    "/stats/:path*",
    "/stake/:path*",
    "/profile/:path*",
    "/dashboard/:path*",
    "/deposit/:path*",
    "/admin/:path*", // Added admin path to matcher
  ],
}
