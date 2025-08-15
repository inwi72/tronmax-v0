import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Add security headers
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("X-XSS-Protection", "1; mode=block")

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
    const token =
      request.cookies.get("next-auth.session-token") || request.cookies.get("__Secure-next-auth.session-token")

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
  ],
}
