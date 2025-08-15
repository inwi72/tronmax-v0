"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Shield, Smartphone, Key, Download, Copy, Check } from "lucide-react"
import Image from "next/image"

interface TwoFactorSetupProps {
  isEnabled: boolean
  onStatusChange: (enabled: boolean) => void
}

export default function TwoFactorSetup({ isEnabled, onStatusChange }: TwoFactorSetupProps) {
  const [step, setStep] = useState<"initial" | "setup" | "verify" | "backup">("initial")
  const [setupData, setSetupData] = useState<{
    secret: string
    qrCode: string
    backupCodes: string[]
    manualEntryKey: string
  } | null>(null)
  const [verificationCode, setVerificationCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [copiedCodes, setCopiedCodes] = useState(false)

  const startSetup = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/2fa/setup", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        setSetupData(data)
        setStep("setup")
      } else {
        setError(data.error || "Failed to setup 2FA")
      }
    } catch (error) {
      setError("Failed to setup 2FA")
    } finally {
      setLoading(false)
    }
  }

  const verifyAndEnable = async () => {
    if (!setupData || !verificationCode) return

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: verificationCode,
          secret: setupData.secret,
          action: "enable",
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("2FA has been successfully enabled!")
        setStep("backup")
      } else {
        setError(data.error || "Verification failed")
      }
    } catch (error) {
      setError("Verification failed")
    } finally {
      setLoading(false)
    }
  }

  const finishSetup = () => {
    onStatusChange(true)
    setStep("initial")
    setSetupData(null)
    setVerificationCode("")
    setSuccess("")
  }

  const disable2FA = async () => {
    setLoading(true)
    setError("")

    try {
      // In a real implementation, you'd verify the user's password or 2FA code first
      const response = await fetch("/api/auth/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: "disable", // Placeholder
          secret: "disable", // Placeholder
          action: "disable",
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("2FA has been disabled")
        onStatusChange(false)
      } else {
        setError(data.error || "Failed to disable 2FA")
      }
    } catch (error) {
      setError("Failed to disable 2FA")
    } finally {
      setLoading(false)
    }
  }

  const copyBackupCodes = () => {
    if (setupData?.backupCodes) {
      navigator.clipboard.writeText(setupData.backupCodes.join("\n"))
      setCopiedCodes(true)
      setTimeout(() => setCopiedCodes(false), 2000)
    }
  }

  const downloadBackupCodes = () => {
    if (setupData?.backupCodes) {
      const content = `TronMax 2FA Backup Codes\nGenerated: ${new Date().toISOString()}\n\n${setupData.backupCodes.join("\n")}\n\nKeep these codes safe! Each code can only be used once.`
      const blob = new Blob([content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "tronmax-backup-codes.txt"
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-tronmax-green flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Two-Factor Authentication
        </CardTitle>
        <CardDescription>Add an extra layer of security to your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Display */}
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Status:</span>
          <Badge
            className={
              isEnabled
                ? "bg-tronmax-green/20 text-tronmax-green border-tronmax-green"
                : "bg-red-500/20 text-red-400 border-red-500"
            }
          >
            {isEnabled ? "Enabled" : "Disabled"}
          </Badge>
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

        {/* Initial State */}
        {step === "initial" && (
          <div className="space-y-4">
            {!isEnabled ? (
              <Button
                onClick={startSetup}
                disabled={loading}
                className="w-full bg-tronmax-green hover:bg-tronmax-green/80 text-black"
              >
                <Smartphone className="w-4 h-4 mr-2" />
                {loading ? "Setting up..." : "Enable 2FA"}
              </Button>
            ) : (
              <div className="space-y-2">
                <Button onClick={disable2FA} disabled={loading} variant="destructive" className="w-full">
                  {loading ? "Disabling..." : "Disable 2FA"}
                </Button>
                <p className="text-sm text-gray-400 text-center">Disabling 2FA will make your account less secure</p>
              </div>
            )}
          </div>
        )}

        {/* Setup Step */}
        {step === "setup" && setupData && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-tronmax-green mb-2">Scan QR Code</h3>
              <p className="text-sm text-gray-400 mb-4">Use Google Authenticator, Authy, or any TOTP app</p>

              <div className="bg-white p-4 rounded-lg inline-block">
                <Image src={setupData.qrCode || "/placeholder.svg"} alt="2FA QR Code" width={200} height={200} />
              </div>
            </div>

            <div>
              <Label className="text-gray-300">Manual Entry Key</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={setupData.manualEntryKey}
                  readOnly
                  className="bg-gray-700 border-gray-600 font-mono text-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(setupData.manualEntryKey)}
                  className="border-tronmax-green text-tronmax-green"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="verification-code" className="text-gray-300">
                Enter 6-digit code from your app
              </Label>
              <Input
                id="verification-code"
                type="text"
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="bg-gray-700 border-gray-600 text-center font-mono text-lg"
                maxLength={6}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setStep("initial")}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300"
              >
                Cancel
              </Button>
              <Button
                onClick={verifyAndEnable}
                disabled={loading || verificationCode.length !== 6}
                className="flex-1 bg-tronmax-green hover:bg-tronmax-green/80 text-black"
              >
                {loading ? "Verifying..." : "Verify & Enable"}
              </Button>
            </div>
          </div>
        )}

        {/* Backup Codes Step */}
        {step === "backup" && setupData && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-tronmax-green mb-2">Save Your Backup Codes</h3>
              <p className="text-sm text-gray-400 mb-4">Store these codes safely. Each can only be used once.</p>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                {setupData.backupCodes.map((code, index) => (
                  <div key={index} className="text-center p-2 bg-gray-800 rounded">
                    {code}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={copyBackupCodes}
                variant="outline"
                className="flex-1 border-tronmax-green text-tronmax-green bg-transparent"
              >
                {copiedCodes ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copiedCodes ? "Copied!" : "Copy Codes"}
              </Button>
              <Button
                onClick={downloadBackupCodes}
                variant="outline"
                className="flex-1 border-tronmax-green text-tronmax-green bg-transparent"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>

            <Button onClick={finishSetup} className="w-full bg-tronmax-green hover:bg-tronmax-green/80 text-black">
              <Key className="w-4 h-4 mr-2" />
              Complete Setup
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
