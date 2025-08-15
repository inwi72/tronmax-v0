"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Wallet, RefreshCw, ExternalLink, Copy, Check } from "lucide-react"

interface WalletData {
  connected: boolean
  address?: string
  balance?: number
  lastUpdated?: string
}

export default function WalletConnection() {
  const [walletData, setWalletData] = useState<WalletData>({ connected: false })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [copied, setCopied] = useState(false)

  const checkWalletStatus = async () => {
    try {
      const response = await fetch("/api/tron/wallet/connect")
      const data = await response.json()

      if (response.ok) {
        setWalletData(data)
      }
    } catch (error) {
      console.error("Failed to check wallet status:", error)
    }
  }

  const connectWallet = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // Check if TronLink is available
      if (typeof window !== "undefined" && (window as any).tronWeb) {
        const tronWeb = (window as any).tronWeb

        // Request account access
        const accounts = await tronWeb.request({ method: "tron_requestAccounts" })

        if (accounts && accounts.length > 0) {
          const address = accounts[0]

          // Create a signature for verification (simplified for demo)
          const message = `Connect wallet to TronMax: ${Date.now()}`
          const signature = await tronWeb.trx.sign(message)

          // Send to backend
          const response = await fetch("/api/tron/wallet/connect", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ walletAddress: address, signature }),
          })

          const data = await response.json()

          if (response.ok) {
            setSuccess("Wallet connected successfully!")
            await checkWalletStatus()
          } else {
            setError(data.error || "Failed to connect wallet")
          }
        } else {
          setError("No accounts found in TronLink")
        }
      } else {
        // TronLink not available, simulate connection for demo
        const mockAddress = "TLyqzVGLV1srkB7dToTAEqgDSfPtXRJZYH"
        const response = await fetch("/api/tron/wallet/connect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            walletAddress: mockAddress,
            signature: "mock_signature_for_demo",
          }),
        })

        const data = await response.json()

        if (response.ok) {
          setSuccess("Wallet connected successfully! (Demo mode)")
          await checkWalletStatus()
        } else {
          setError(data.error || "Failed to connect wallet")
        }
      }
    } catch (error) {
      setError("Failed to connect wallet. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const refreshBalance = async () => {
    if (!walletData.address) return

    setLoading(true)
    try {
      const response = await fetch(`/api/tron/balance?address=${walletData.address}`)
      const data = await response.json()

      if (response.ok) {
        setWalletData((prev) => ({ ...prev, balance: data.balance, lastUpdated: data.lastUpdated }))
      }
    } catch (error) {
      console.error("Failed to refresh balance:", error)
    } finally {
      setLoading(false)
    }
  }

  const copyAddress = () => {
    if (walletData.address) {
      navigator.clipboard.writeText(walletData.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const openInExplorer = () => {
    if (walletData.address) {
      window.open(`https://tronscan.org/#/address/${walletData.address}`, "_blank")
    }
  }

  useEffect(() => {
    checkWalletStatus()
  }, [])

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-tronmax-green flex items-center">
          <Wallet className="w-5 h-5 mr-2" />
          TRON Wallet
        </CardTitle>
        <CardDescription>Connect your TRON wallet to manage TRX</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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

        {!walletData.connected ? (
          <div className="text-center space-y-4">
            <p className="text-gray-400">Connect your TRON wallet to get started</p>
            <Button
              onClick={connectWallet}
              disabled={loading}
              className="w-full bg-tronmax-green hover:bg-tronmax-green/80 text-black"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </>
              )}
            </Button>
            <p className="text-xs text-gray-500">
              Make sure you have TronLink extension installed or use WalletConnect
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Wallet Status */}
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Status:</span>
              <Badge className="bg-tronmax-green/20 text-tronmax-green border-tronmax-green">Connected</Badge>
            </div>

            {/* Wallet Address */}
            {walletData.address && (
              <div className="space-y-2">
                <span className="text-gray-300 text-sm">Wallet Address:</span>
                <div className="flex items-center gap-2 p-2 bg-gray-700 rounded border">
                  <span className="font-mono text-sm text-white flex-1 truncate">{walletData.address}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={copyAddress}
                    className="text-tronmax-green hover:text-tronmax-green/80"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={openInExplorer}
                    className="text-tronmax-green hover:text-tronmax-green/80"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Balance */}
            {walletData.balance !== undefined && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Balance:</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={refreshBalance}
                    disabled={loading}
                    className="text-tronmax-green hover:text-tronmax-green/80"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                  </Button>
                </div>
                <div className="text-2xl font-bold text-tronmax-green">{walletData.balance.toFixed(6)} TRX</div>
                {walletData.lastUpdated && (
                  <p className="text-xs text-gray-500">
                    Last updated: {new Date(walletData.lastUpdated).toLocaleString()}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
