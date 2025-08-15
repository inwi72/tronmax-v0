"use client"

import { useEffect, useState } from "react"

interface CryptoPrice {
  bitcoin: { usd: number }
  ethereum: { usd: number }
  tron: { usd: number }
  binancecoin: { usd: number }
  ripple: { usd: number }
}

export function CryptoTicker() {
  const [prices, setPrices] = useState<string>("Loading prices...")

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tron,binancecoin,ripple&vs_currencies=usd",
        )

        if (!response.ok) throw new Error("API error")

        const data: CryptoPrice = await response.json()
        const priceStrings = [
          `BTC: $${data.bitcoin.usd.toFixed(2)}`,
          `ETH: $${data.ethereum.usd.toFixed(2)}`,
          `TRX: $${data.tron.usd.toFixed(4)}`,
          `BNB: $${data.binancecoin.usd.toFixed(2)}`,
          `XRP: $${data.ripple.usd.toFixed(4)}`,
        ]
        setPrices(priceStrings.join(" | "))
      } catch (error) {
        setPrices("Unable to load prices...")
      }
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-gray-900 border-t border-b border-tronmax-green overflow-hidden">
      <div className="whitespace-nowrap py-2 text-sm text-tronmax-green animate-marquee">{prices}</div>
    </div>
  )
}
