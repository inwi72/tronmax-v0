"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Search, Download, RefreshCw, Filter } from "lucide-react"
import { AuditEventType, AuditLevel } from "@/app/api/audit/log/route"

interface AuditLog {
  id: string
  timestamp: string
  userId?: string
  userEmail?: string
  ipAddress: string
  eventType: AuditEventType
  level: AuditLevel
  message: string
  details?: Record<string, any>
}

interface AuditLogsResponse {
  logs: AuditLog[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  filters: Record<string, string>
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0,
  })

  // Filters
  const [filters, setFilters] = useState({
    level: "all",
    eventType: "all",
    userId: "",
    startDate: "",
    endDate: "",
  })

  const [showFilters, setShowFilters] = useState(false)

  const fetchLogs = async (page = 1) => {
    setLoading(true)
    setError("")

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...Object.fromEntries(Object.entries(filters).filter(([_, value]) => value)),
      })

      const response = await fetch(`/api/audit/log?${params}`)
      const data: AuditLogsResponse = await response.json()

      if (response.ok) {
        setLogs(data.logs)
        setPagination(data.pagination)
      } else {
        setError(data.error || "Failed to fetch audit logs")
      }
    } catch (error) {
      setError("Failed to fetch audit logs")
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    fetchLogs(1)
  }

  const clearFilters = () => {
    setFilters({
      level: "all",
      eventType: "all",
      userId: "",
      startDate: "",
      endDate: "",
    })
    setTimeout(() => fetchLogs(1), 100)
  }

  const exportLogs = () => {
    const csvContent = [
      "Timestamp,User Email,IP Address,Event Type,Level,Message,Details",
      ...logs.map((log) =>
        [
          log.timestamp,
          log.userEmail || "N/A",
          log.ipAddress,
          log.eventType,
          log.level,
          `"${log.message}"`,
          `"${JSON.stringify(log.details || {})}"`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getLevelColor = (level: AuditLevel) => {
    switch (level) {
      case AuditLevel.INFO:
        return "bg-blue-500/20 text-blue-400 border-blue-500"
      case AuditLevel.WARNING:
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500"
      case AuditLevel.ERROR:
        return "bg-red-500/20 text-red-400 border-red-500"
      case AuditLevel.CRITICAL:
        return "bg-red-600/20 text-red-300 border-red-600"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-tronmax-green flex items-center">
              <Shield className="w-8 h-8 mr-3" />
              Audit Logs
            </h1>
            <p className="text-gray-400 mt-1">Security and activity monitoring</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="border-tronmax-green text-tronmax-green bg-transparent"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button
              onClick={exportLogs}
              variant="outline"
              className="border-tronmax-green text-tronmax-green bg-transparent"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => fetchLogs(pagination.page)} className="bg-tronmax-green hover:bg-tronmax-green/80">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-tronmax-green">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div>
                  <Label>Level</Label>
                  <Select value={filters.level} onValueChange={(value) => handleFilterChange("level", value)}>
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue placeholder="All levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All levels</SelectItem>
                      <SelectItem value={AuditLevel.INFO}>Info</SelectItem>
                      <SelectItem value={AuditLevel.WARNING}>Warning</SelectItem>
                      <SelectItem value={AuditLevel.ERROR}>Error</SelectItem>
                      <SelectItem value={AuditLevel.CRITICAL}>Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Event Type</Label>
                  <Select value={filters.eventType} onValueChange={(value) => handleFilterChange("eventType", value)}>
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue placeholder="All events" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All events</SelectItem>
                      <SelectItem value={AuditEventType.LOGIN_SUCCESS}>Login Success</SelectItem>
                      <SelectItem value={AuditEventType.LOGIN_FAILED}>Login Failed</SelectItem>
                      <SelectItem value={AuditEventType.WITHDRAWAL_REQUEST}>Withdrawal Request</SelectItem>
                      <SelectItem value={AuditEventType.SUSPICIOUS_ACTIVITY}>Suspicious Activity</SelectItem>
                      <SelectItem value={AuditEventType.RATE_LIMIT_EXCEEDED}>Rate Limit Exceeded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>User ID</Label>
                  <Input
                    placeholder="User ID"
                    value={filters.userId}
                    onChange={(e) => handleFilterChange("userId", e.target.value)}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>

                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange("startDate", e.target.value)}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>

                <div>
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange("endDate", e.target.value)}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button onClick={applyFilters} className="bg-tronmax-green hover:bg-tronmax-green/80">
                  <Search className="w-4 h-4 mr-2" />
                  Apply Filters
                </Button>
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="border-gray-600 text-gray-300 bg-transparent"
                >
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Alert className="border-red-500 bg-red-500/10">
            <AlertDescription className="text-red-400">{error}</AlertDescription>
          </Alert>
        )}

        {/* Logs Table */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-tronmax-green">
              Audit Events ({pagination.total.toLocaleString()} total)
            </CardTitle>
            <CardDescription>Recent security and activity events</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-tronmax-green" />
                <p className="text-gray-400 mt-2">Loading audit logs...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-tronmax-green">Timestamp</TableHead>
                      <TableHead className="text-tronmax-green">User</TableHead>
                      <TableHead className="text-tronmax-green">IP Address</TableHead>
                      <TableHead className="text-tronmax-green">Event</TableHead>
                      <TableHead className="text-tronmax-green">Level</TableHead>
                      <TableHead className="text-tronmax-green">Message</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id} className="border-gray-700">
                        <TableCell className="text-gray-300 font-mono text-sm">
                          {formatTimestamp(log.timestamp)}
                        </TableCell>
                        <TableCell className="text-gray-300">{log.userEmail || "Anonymous"}</TableCell>
                        <TableCell className="text-gray-300 font-mono">{log.ipAddress}</TableCell>
                        <TableCell className="text-gray-300">{log.eventType.replace(/_/g, " ")}</TableCell>
                        <TableCell>
                          <Badge className={getLevelColor(log.level)}>{log.level.toUpperCase()}</Badge>
                        </TableCell>
                        <TableCell className="text-gray-300 max-w-md truncate">{log.message}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex items-center justify-between">
                  <p className="text-gray-400 text-sm">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => fetchLogs(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                      variant="outline"
                      className="border-gray-600 text-gray-300"
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => fetchLogs(pagination.page + 1)}
                      disabled={pagination.page >= pagination.pages}
                      variant="outline"
                      className="border-gray-600 text-gray-300"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
