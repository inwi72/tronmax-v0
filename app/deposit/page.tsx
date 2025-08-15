"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TransactionHistory } from "@/components/transaction-history"
import WalletConnection from "@/components/wallet-connection"
import WithdrawalManager from "@/components/withdrawal-manager"
import { ArrowDownToLine, ArrowUpFromLine, History } from "lucide-react"

export default function DepositWithdrawalPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-tronmax-green">Deposit & Withdrawal</h1>

        <Tabs defaultValue="wallet" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800">
            <TabsTrigger value="wallet" className="data-[state=active]:bg-tronmax-green data-[state=active]:text-black">
              <ArrowDownToLine className="w-4 h-4 mr-2" />
              Wallet
            </TabsTrigger>
            <TabsTrigger
              value="withdraw"
              className="data-[state=active]:bg-tronmax-green data-[state=active]:text-black"
            >
              <ArrowUpFromLine className="w-4 h-4 mr-2" />
              Withdraw
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-tronmax-green data-[state=active]:text-black"
            >
              <History className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wallet" className="space-y-6">
            <WalletConnection />
          </TabsContent>

          <TabsContent value="withdraw" className="space-y-6">
            <WithdrawalManager />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <TransactionHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
