"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [requiresVerification, setRequiresVerification] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    // Client-side validation
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.requiresVerification) {
          setRequiresVerification(true)
          setSuccess("Registration successful! Please check your email to verify your account before logging in.")
        } else {
          setSuccess("Account created successfully! You can now login.")
          setTimeout(() => {
            router.push("/auth/login")
          }, 2000)
        }
      } else {
        setError(data.error || "Registration failed")
      }
    } catch (error) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (requiresVerification) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-800 border-tronmax-green/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-tronmax-green">📧 Check Your Email</CardTitle>
            <CardDescription className="text-gray-400">Verification required</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="p-6 bg-tronmax-green/10 rounded-lg border border-tronmax-green/20">
              <p className="text-tronmax-green font-medium mb-2">Registration Successful!</p>
              <p className="text-gray-300 text-sm">
                We've sent a verification email to <strong className="text-white">{email}</strong>
              </p>
            </div>
            <div className="text-left space-y-2 text-sm text-gray-400">
              <p>• Check your inbox (and spam folder)</p>
              <p>• Click the verification link</p>
              <p>• Return here to login</p>
              <p className="text-xs text-gray-500">Link expires in 24 hours</p>
            </div>
            <div className="pt-4">
              <Link href="/auth/login">
                <Button className="w-full bg-tronmax-green hover:bg-tronmax-green/80 text-black font-semibold">
                  Go to Login
                </Button>
              </Link>
            </div>
            <div className="text-center">
              <button
                onClick={() => {
                  setRequiresVerification(false)
                  setSuccess("")
                  setName("")
                  setEmail("")
                  setPassword("")
                  setConfirmPassword("")
                }}
                className="text-tronmax-green hover:underline text-sm"
              >
                Register Different Email
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-tronmax-green/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-tronmax-green">Join TronMax</CardTitle>
          <CardDescription className="text-gray-400">Create your TRX faucet account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-tronmax-green"
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-tronmax-green"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password (min 8 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-tronmax-green"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-tronmax-green"
              />
            </div>
            {error && (
              <Alert className="border-red-500 bg-red-500/10">
                <AlertDescription className="text-red-400">{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="border-tronmax-green bg-tronmax-green/10">
                <AlertDescription className="text-tronmax-green">{success}</AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-tronmax-green hover:bg-tronmax-green/80 text-black font-semibold"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-tronmax-green hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
