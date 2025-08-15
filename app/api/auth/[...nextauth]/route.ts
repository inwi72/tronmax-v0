import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { RateLimiterMemory } from "rate-limiter-flexible"

// Rate limiter for login attempts
const loginLimiter = new RateLimiterMemory({
  keyGenerator: (req: any) => req.ip,
  points: 5, // Number of attempts
  duration: 900, // Per 15 minutes
})

// Mock user database - replace with real database
const users = [
  {
    id: "1",
    email: "admin@tronmax.com",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm", // password123
    name: "Admin User",
    twoFactorSecret: null,
    twoFactorEnabled: false,
    walletAddress: null,
    balance: 0,
    role: "admin",
  },
  {
    id: "2",
    email: "user@tronmax.com",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm", // password123
    name: "Regular User",
    twoFactorSecret: null,
    twoFactorEnabled: false,
    walletAddress: null,
    balance: 0,
    role: "user",
  },
]

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        twoFactorCode: { label: "2FA Code", type: "text", required: false },
      },
      async authorize(credentials, req) {
        try {
          // Rate limiting check
          await loginLimiter.consume(req.ip)

          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password required")
          }

          // Find user in database
          const user = users.find((u) => u.email === credentials.email)
          if (!user) {
            throw new Error("Invalid credentials")
          }

          // Verify password
          const isValidPassword = await bcrypt.compare(credentials.password, user.password)
          if (!isValidPassword) {
            throw new Error("Invalid credentials")
          }

          // Check 2FA if enabled
          if (user.twoFactorEnabled && credentials.twoFactorCode) {
            const speakeasy = require("speakeasy")
            const verified = speakeasy.totp.verify({
              secret: user.twoFactorSecret,
              encoding: "base32",
              token: credentials.twoFactorCode,
              window: 2,
            })

            if (!verified) {
              throw new Error("Invalid 2FA code")
            }
          } else if (user.twoFactorEnabled && !credentials.twoFactorCode) {
            throw new Error("2FA code required")
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            balance: user.balance,
            walletAddress: user.walletAddress,
            twoFactorEnabled: user.twoFactorEnabled,
          }
        } catch (error) {
          console.error("Auth error:", error)
          throw error
        }
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET || "your-secret-key",
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.balance = user.balance
        token.walletAddress = user.walletAddress
        token.twoFactorEnabled = user.twoFactorEnabled
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub
        session.user.role = token.role
        session.user.balance = token.balance
        session.user.walletAddress = token.walletAddress
        session.user.twoFactorEnabled = token.twoFactorEnabled
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
    signUp: "/auth/register",
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
