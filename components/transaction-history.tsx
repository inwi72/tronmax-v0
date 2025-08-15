"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Search,
  Filter,
  Coins,
  Gamepad2,
  Users,
  Wallet,
} from "lucide-react"

interface Transaction {
  id: string
  type: "deposit" | "withdrawal" | "claim" | "referral" | "staking" | "multiply"
  amount: number
  status: "completed" | "pending" | "failed"
  date: string
  txHash?: string
  description: string
}

export function TransactionHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const transactions: Transaction[] = [
    {
      id: "1",
      type: "deposit",
      amount: 50.0,
      status: "completed",
      date: "2024-01-15 14:30:25",
      txHash: "abc123def456ghi789jkl012mno345pqr678stu901vwx234",
      description: "TRX Deposit",
    },
    {
      id: "2",
      type: "withdrawal",
      amount: 25.0,
      status: "pending",
      date: "2024-01-14 10:15:42",
      txHash: "ghi789jkl012mno345pqr678stu901vwx234abc123def456",
      description: "TRX Withdrawal to TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE",
    },
    {
      id: "3",
      type: "claim",
      amount: 0.00000123,
      status: "completed",
      date: "2024-01-15 16:45:12",
      description: "Hourly Faucet Claim",
    },
    {
      id: "4",
      type: "referral",
      amount: 0.00000045,
      status: "completed",
      date: "2024-01-15 12:20:33",
      description: "Referral Commission from User456",
    },
    {
      id: "5",
      type: "staking",
      amount: 0.00000234,
      status: "completed",
      date: "2024-01-15 08:00:00",
      description: "Daily Staking Reward - Plan Silver",
    },
    {
      id: "6",
      type: "multiply",
      amount: -0.000001,
      status: "completed",
      date: "2024-01-14 20:30:15",
      description: "Hi-Lo Game Loss",
    },
    {
      id: "7",
      type: "multiply",
      amount: 0.000002,
      status: "completed",
      date: "2024-01-14 19:15:22",
      description: "Hi-Lo Game Win",
    },
    {
      id: "8",
      type: "withdrawal",
      amount: 15.0,
      status: "failed",
      date: "2024-01-12 09:20:18",
      txHash: "stu901vwx234abc123def456ghi789jkl012mno345pqr678",
      description: "TRX Withdrawal Failed - Insufficient Balance",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500"
      case "failed":
        return "bg-red-500/20 text-red-400 border-red-500"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownToLine className="w-4 h-4 text-tronmax-green" />
      case "withdrawal":
        return <ArrowUpFromLine className="w-4 h-4 text-blue-400" />
      case "claim":
        return <Coins className="w-4 h-4 text-tronmax-green" />
      case "referral":
        return <Users className="w-4 h-4 text-purple-400" />
      case "staking":
        return <Wallet className="w-4 h-4 text-orange-400" />
      case "multiply":
        return <Gamepad2 className="w-4 h-4 text-pink-400" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "deposit":
        return "bg-tronmax-green/20 text-tronmax-green border-tronmax-green"
      case "withdrawal":
        return "bg-blue-500/20 text-blue-400 border-blue-500"
      case "claim":
        return "bg-tronmax-green/20 text-tronmax-green border-tronmax-green"
      case "referral":
        return "bg-purple-500/20 text-purple-400 border-purple-500"
      case "staking":
        return "bg-orange-500/20 text-orange-400 border-orange-500"
      case "multiply":
        return "bg-pink-500/20 text-pink-400 border-pink-500"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500"
    }
  }

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.txHash && tx.txHash.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = filterType === "all" || tx.type === filterType
    const matchesStatus = filterStatus === "all" || tx.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-tronmax-green">Transaction History</CardTitle>
        <CardDescription>Complete history of all your transactions and activities</CardDescription>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-700 border-gray-600"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-40 bg-gray-700 border-gray-600">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="deposit">Deposit</SelectItem>
              <SelectItem value="withdrawal">Withdrawal</SelectItem>
              <SelectItem value="claim">Claim</SelectItem>
              <SelectItem value="referral">Referral</SelectItem>
              <SelectItem value="staking">Staking</SelectItem>
              <SelectItem value="multiply">Multiply</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-40 bg-gray-700 border-gray-600">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No transactions found matching your criteria</p>
            </div>
          ) : (
            filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(tx.type)}
                    <Badge variant="outline" className={getTypeColor(tx.type)}>
                      {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <div className="font-medium text-gray-300">{tx.description}</div>
                    <div className="text-sm text-gray-400">{tx.date}</div>
                    {tx.txHash && (
                      <div className="text-xs text-gray-500 flex items-center space-x-2 mt-1">
                        <span>
                          TX: {tx.txHash.slice(0, 8)}...{tx.txHash.slice(-8)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(tx.txHash!)}
                          className="h-4 w-4 p-0 text-gray-400 hover:text-tronmax-green"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className={`font-semibold ${tx.amount > 0 ? "text-tronmax-green" : "text-red-400"}`}>
                      {tx.amount > 0 ? "+" : ""}
                      {tx.amount.toFixed(8)} TRX
                    </div>
                    <Badge variant="outline" className={getStatusColor(tx.status)}>
                      {getStatusIcon(tx.status)}
                      <span className="ml-1 capitalize">{tx.status}</span>
                    </Badge>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
