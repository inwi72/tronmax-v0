"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Coins, TrendingUp, TrendingDown, Dice1, RotateCcw } from "lucide-react"

export default function MultiplyPage() {
  const [balance, setBalance] = useState(0.1) // Starting balance
  const [betAmount, setBetAmount] = useState(0.001)
  const [currentNumber, setCurrentNumber] = useState(50)
  const [nextNumber, setNextNumber] = useState<number | null>(null)
  const [multiplier, setMultiplier] = useState(2.0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [gameResult, setGameResult] = useState<"win" | "lose" | null>(null)
  const [winChance, setWinChance] = useState(50)
  const [gameHistory, setGameHistory] = useState<
    Array<{ id: number; bet: number; result: "win" | "lose"; profit: number }>
  >([])

  // Calculate multiplier based on win chance
  useEffect(() => {
    const newMultiplier = (100 / winChance) * 0.99 // 1% house edge
    setMultiplier(Number(newMultiplier.toFixed(2)))
  }, [winChance])

  const generateRandomNumber = () => Math.floor(Math.random() * 100) + 1

  const playHi = async () => {
    if (betAmount > balance) return

    setIsPlaying(true)
    setGameResult(null)

    // Generate next number after delay for suspense
    setTimeout(() => {
      const next = generateRandomNumber()
      setNextNumber(next)

      const won = next > currentNumber
      const profit = won ? betAmount * (multiplier - 1) : -betAmount

      setGameResult(won ? "win" : "lose")
      setBalance((prev) => prev + profit)

      // Add to history
      setGameHistory((prev) => [
        {
          id: Date.now(),
          bet: betAmount,
          result: won ? "win" : "lose",
          profit: profit,
        },
        ...prev.slice(0, 9),
      ]) // Keep last 10 games

      setCurrentNumber(next)
      setIsPlaying(false)
    }, 2000)
  }

  const playLo = async () => {
    if (betAmount > balance) return

    setIsPlaying(true)
    setGameResult(null)

    setTimeout(() => {
      const next = generateRandomNumber()
      setNextNumber(next)

      const won = next < currentNumber
      const profit = won ? betAmount * (multiplier - 1) : -betAmount

      setGameResult(won ? "win" : "lose")
      setBalance((prev) => prev + profit)

      setGameHistory((prev) => [
        {
          id: Date.now(),
          bet: betAmount,
          result: won ? "win" : "lose",
          profit: profit,
        },
        ...prev.slice(0, 9),
      ])

      setCurrentNumber(next)
      setIsPlaying(false)
    }, 2000)
  }

  const resetGame = () => {
    setCurrentNumber(generateRandomNumber())
    setNextNumber(null)
    setGameResult(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Balance Display */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Multiply TRX - Hi-Lo Game
          </h1>
          <Badge variant="outline" className="bg-cyan-500/10 border-cyan-500 text-cyan-400 px-4 py-2 text-lg">
            <Coins className="w-5 h-5 mr-2" />
            Balance: {balance.toFixed(6)} TRX
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game Area */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-center text-xl">Current Number</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Number Display */}
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-4xl font-bold shadow-lg">
                    {isPlaying ? (
                      <div className="animate-spin">
                        <Dice1 className="w-12 h-12" />
                      </div>
                    ) : (
                      currentNumber
                    )}
                  </div>
                  {nextNumber && (
                    <div className="mt-4">
                      <div className="text-sm text-gray-400 mb-2">Next Number</div>
                      <div className={`text-2xl font-bold ${gameResult === "win" ? "text-green-400" : "text-red-400"}`}>
                        {nextNumber}
                      </div>
                    </div>
                  )}
                </div>

                {/* Game Result */}
                {gameResult && (
                  <div
                    className={`text-center p-4 rounded-lg ${gameResult === "win" ? "bg-green-500/20 border border-green-500/30" : "bg-red-500/20 border border-red-500/30"}`}
                  >
                    <div className={`text-2xl font-bold ${gameResult === "win" ? "text-green-400" : "text-red-400"}`}>
                      {gameResult === "win" ? "YOU WIN!" : "YOU LOSE!"}
                    </div>
                    <div className="text-gray-300 mt-2">
                      {gameResult === "win"
                        ? `+${(betAmount * (multiplier - 1)).toFixed(6)} TRX`
                        : `-${betAmount.toFixed(6)} TRX`}
                    </div>
                  </div>
                )}

                {/* Game Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={playHi}
                    disabled={isPlaying || betAmount > balance}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-6 text-lg font-bold"
                  >
                    <TrendingUp className="w-6 h-6 mr-2" />
                    HI ({winChance}%)
                  </Button>
                  <Button
                    onClick={playLo}
                    disabled={isPlaying || betAmount > balance}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-6 text-lg font-bold"
                  >
                    <TrendingDown className="w-6 h-6 mr-2" />
                    LO ({100 - winChance}%)
                  </Button>
                </div>

                <Button
                  onClick={resetGame}
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  New Game
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Betting Controls */}
          <div className="space-y-6">
            {/* Bet Amount */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg">Bet Amount</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Number(e.target.value))}
                  step="0.001"
                  min="0.001"
                  max={balance}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => setBetAmount(betAmount * 2)}
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300"
                  >
                    2x
                  </Button>
                  <Button
                    onClick={() => setBetAmount(betAmount / 2)}
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300"
                  >
                    1/2
                  </Button>
                  <Button
                    onClick={() => setBetAmount(0.001)}
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300"
                  >
                    Min
                  </Button>
                  <Button
                    onClick={() => setBetAmount(balance)}
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300"
                  >
                    Max
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Win Chance */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg">Win Chance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">{winChance}%</div>
                  <div className="text-sm text-gray-400">Multiplier: {multiplier}x</div>
                </div>
                <Slider
                  value={[winChance]}
                  onValueChange={(value) => setWinChance(value[0])}
                  min={1}
                  max={95}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>1%</span>
                  <span>95%</span>
                </div>
              </CardContent>
            </Card>

            {/* Potential Profit */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg">Potential Profit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-400">
                    +{(betAmount * (multiplier - 1)).toFixed(6)} TRX
                  </div>
                  <div className="text-sm text-gray-400 mt-1">On Win</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Game History */}
        {gameHistory.length > 0 && (
          <Card className="bg-gray-800/50 border-gray-700 mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Recent Games</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {gameHistory.map((game) => (
                  <div
                    key={game.id}
                    className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      <Badge variant={game.result === "win" ? "default" : "destructive"} className="w-12">
                        {game.result === "win" ? "WIN" : "LOSE"}
                      </Badge>
                      <span className="text-gray-300">Bet: {game.bet.toFixed(6)} TRX</span>
                    </div>
                    <div className={`font-bold ${game.result === "win" ? "text-green-400" : "text-red-400"}`}>
                      {game.profit > 0 ? "+" : ""}
                      {game.profit.toFixed(6)} TRX
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
