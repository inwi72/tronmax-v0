"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { ArrowUpRight, Clock, CheckCircle, XCircle, ExternalLink } from "lucide-react"

interface WithdrawalRequest {
  id: string
  userId: string
  userEmail: string
  amount: number
  toAddress: string
  status: "pending" | "approved" | "rejected" | "completed"
  requestedAt: string
  processedAt?: string
  txHash?: string
  adminNotes?: string
}

interface WithdrawalManagerProps {
  isAdmin?: boolean
}

export default function WithdrawalManager({ isAdmin = false }: WithdrawalManagerProps) {
  const [amount, setAmount] = useState("")
  const [toAddress, setToAddress] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null)
  const [adminNotes, setAdminNotes] = useState("")
  const [txHash, setTxHash] = useState("")

  const fetchWithdrawals = async () => {
    try {
      const response = await fetch("/api/tron/withdraw")
      const data = await response.json()

      if (response.ok) {
        setWithdrawals(data.withdrawals)
      }
    } catch (error) {
      console.error("Failed to fetch withdrawals:", error)
    }
  }

  const submitWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/tron/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number.parseFloat(amount),
          toAddress,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message)
        setAmount("")
        setToAddress("")
        await fetchWithdrawals()
      } else {
        setError(data.error || "Withdrawal request failed")
      }
    } catch (error) {
      setError("Failed to submit withdrawal request")
    } finally {
      setLoading(false)
    }
  }

  const processWithdrawal = async (requestId: string, action: "approved" | "rejected") => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/tron/withdraw", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId,
          action,
          adminNotes,
          txHash: action === "approved" ? txHash : undefined,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(`Withdrawal ${action} successfully`)
        setSelectedRequest(null)
        setAdminNotes("")
        setTxHash("")
        await fetchWithdrawals()
      } else {
        setError(data.error || "Failed to process withdrawal")
      }
    } catch (error) {
      setError("Failed to process withdrawal")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500"
      case "approved":
        return "bg-tronmax-green/20 text-tronmax-green border-tronmax-green"
      case "rejected":
        return "bg-red-500/20 text-red-400 border-red-500"
      case "completed":
        return "bg-blue-500/20 text-blue-400 border-blue-500"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "approved":
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "rejected":
        return <XCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  useEffect(() => {
    fetchWithdrawals()
  }, [])

  return (
    <div className="space-y-6">
      {/* Withdrawal Form */}
      {!isAdmin && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-tronmax-green flex items-center">
              <ArrowUpRight className="w-5 h-5 mr-2" />
              Request Withdrawal
            </CardTitle>
            <CardDescription>Submit a withdrawal request for manual approval</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitWithdrawal} className="space-y-4">
              <div>
                <Label htmlFor="amount">Amount (TRX)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="10.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="10"
                  max="10000"
                  step="0.000001"
                  required
                  className="bg-gray-700 border-gray-600"
                />
                <p className="text-xs text-gray-500 mt-1">Minimum: 10 TRX, Maximum: 10,000 TRX</p>
              </div>

              <div>
                <Label htmlFor="toAddress">TRON Address</Label>
                <Input
                  id="toAddress"
                  placeholder="TLyqzVGLV1srkB7dToTAEqgDSfPtXRJZYH"
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value)}
                  required
                  className="bg-gray-700 border-gray-600 font-mono"
                />
                <p className="text-xs text-gray-500 mt-1">Enter a valid TRON wallet address</p>
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
                className="w-full bg-tronmax-green hover:bg-tronmax-green/80 text-black"
              >
                {loading ? "Submitting..." : "Submit Withdrawal Request"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Withdrawal History */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-tronmax-green">
            {isAdmin ? "All Withdrawal Requests" : "Your Withdrawal History"}
          </CardTitle>
          <CardDescription>{isAdmin ? "Manage withdrawal requests" : "Track your withdrawal requests"}</CardDescription>
        </CardHeader>
        <CardContent>
          {withdrawals.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No withdrawal requests found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-tronmax-green">Date</TableHead>
                  {isAdmin && <TableHead className="text-tronmax-green">User</TableHead>}
                  <TableHead className="text-tronmax-green">Amount</TableHead>
                  <TableHead className="text-tronmax-green">Address</TableHead>
                  <TableHead className="text-tronmax-green">Status</TableHead>
                  <TableHead className="text-tronmax-green">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdrawals.map((withdrawal) => (
                  <TableRow key={withdrawal.id} className="border-gray-700">
                    <TableCell className="text-gray-300">
                      {new Date(withdrawal.requestedAt).toLocaleDateString()}
                    </TableCell>
                    {isAdmin && <TableCell className="text-gray-300">{withdrawal.userEmail}</TableCell>}
                    <TableCell className="text-gray-300 font-semibold">{withdrawal.amount} TRX</TableCell>
                    <TableCell className="text-gray-300 font-mono text-sm">
                      {withdrawal.toAddress.slice(0, 8)}...{withdrawal.toAddress.slice(-6)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(withdrawal.status)}>
                        {getStatusIcon(withdrawal.status)}
                        <span className="ml-1">{withdrawal.status.toUpperCase()}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {withdrawal.txHash && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              window.open(`https://tronscan.org/#/transaction/${withdrawal.txHash}`, "_blank")
                            }
                            className="text-tronmax-green hover:text-tronmax-green/80"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        )}
                        {isAdmin && withdrawal.status === "pending" && (
                          <Button
                            size="sm"
                            onClick={() => setSelectedRequest(withdrawal)}
                            className="bg-tronmax-green hover:bg-tronmax-green/80 text-black"
                          >
                            Process
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Admin Processing Modal */}
      {isAdmin && selectedRequest && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-tronmax-green">Process Withdrawal Request</CardTitle>
            <CardDescription>Review and approve/reject withdrawal request</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>User</Label>
                <p className="text-gray-300">{selectedRequest.userEmail}</p>
              </div>
              <div>
                <Label>Amount</Label>
                <p className="text-gray-300 font-semibold">{selectedRequest.amount} TRX</p>
              </div>
              <div className="col-span-2">
                <Label>To Address</Label>
                <p className="text-gray-300 font-mono text-sm">{selectedRequest.toAddress}</p>
              </div>
            </div>

            <div>
              <Label htmlFor="adminNotes">Admin Notes</Label>
              <Textarea
                id="adminNotes"
                placeholder="Add notes about this withdrawal..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="bg-gray-700 border-gray-600"
              />
            </div>

            <div>
              <Label htmlFor="txHash">Transaction Hash (if approved)</Label>
              <Input
                id="txHash"
                placeholder="Enter transaction hash after sending TRX"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                className="bg-gray-700 border-gray-600 font-mono"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => processWithdrawal(selectedRequest.id, "approved")}
                disabled={loading}
                className="flex-1 bg-tronmax-green hover:bg-tronmax-green/80 text-black"
              >
                {loading ? "Processing..." : "Approve"}
              </Button>
              <Button
                onClick={() => processWithdrawal(selectedRequest.id, "rejected")}
                disabled={loading}
                variant="destructive"
                className="flex-1"
              >
                {loading ? "Processing..." : "Reject"}
              </Button>
              <Button onClick={() => setSelectedRequest(null)} variant="outline" className="border-gray-600">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
