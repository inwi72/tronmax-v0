"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { RefreshCw } from "lucide-react"

interface CaptchaWidgetProps {
  onVerify: (isValid: boolean) => void
  required?: boolean
}

export default function CaptchaWidget({ onVerify, required = false }: CaptchaWidgetProps) {
  const [captchaData, setCaptchaData] = useState<{ id: string; question: string } | null>(null)
  const [answer, setAnswer] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [verified, setVerified] = useState(false)

  const loadCaptcha = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/auth/captcha")
      const data = await response.json()

      if (response.ok) {
        setCaptchaData(data)
        setError("")
        setVerified(false)
        setAnswer("")
        onVerify(false)
      } else {
        setError(data.error || "Failed to load CAPTCHA")
      }
    } catch (error) {
      setError("Failed to load CAPTCHA")
    } finally {
      setLoading(false)
    }
  }

  const verifyCaptcha = async () => {
    if (!captchaData || !answer) return

    try {
      setLoading(true)
      const response = await fetch("/api/auth/captcha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          captchaId: captchaData.id,
          answer: answer,
        }),
      })

      const data = await response.json()

      if (response.ok && data.valid) {
        setVerified(true)
        setError("")
        onVerify(true)
      } else {
        setError("Incorrect answer. Please try again.")
        setVerified(false)
        onVerify(false)
        loadCaptcha() // Load new CAPTCHA
      }
    } catch (error) {
      setError("Verification failed")
      onVerify(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (required) {
      loadCaptcha()
    }
  }, [required])

  if (!required && !captchaData) {
    return null
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Security Check</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={loadCaptcha}
              disabled={loading}
              className="text-tronmax-green hover:text-tronmax-green/80"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>

          {captchaData && (
            <div className="space-y-2">
              <div className="text-center p-3 bg-gray-700 rounded border">
                <span className="text-lg font-mono text-white">{captchaData.question} = ?</span>
              </div>

              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && verifyCaptcha()}
                  disabled={loading || verified}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Button
                  type="button"
                  onClick={verifyCaptcha}
                  disabled={loading || !answer || verified}
                  className="bg-tronmax-green hover:bg-tronmax-green/80 text-black"
                >
                  {loading ? "..." : verified ? "✓" : "Verify"}
                </Button>
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}

          {verified && <p className="text-sm text-tronmax-green">✓ Verification successful</p>}
        </div>
      </CardContent>
    </Card>
  )
}
