import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface StakingPlan {
  name: string
  amount: number
  dailyReturn: string
  duration: number
  description: string
}

const stakingPlans: StakingPlan[] = [
  {
    name: "Starter Pack",
    amount: 5,
    dailyReturn: "0.01%",
    duration: 7,
    description: "Perfect for beginners to start their staking journey",
  },
  {
    name: "Beginner Boost",
    amount: 10,
    dailyReturn: "0.1%",
    duration: 10,
    description: "Step up your staking with better returns",
  },
  {
    name: "Smart Choice",
    amount: 50,
    dailyReturn: "1%",
    duration: 15,
    description: "Smart staking for consistent growth",
  },
  {
    name: "Growth Mode",
    amount: 100,
    dailyReturn: "5%",
    duration: 30,
    description: "Accelerated staking for serious growth",
  },
  {
    name: "Pro Staker",
    amount: 500,
    dailyReturn: "7%",
    duration: 45,
    description: "Professional-level staking rewards",
  },
  {
    name: "Elite Max",
    amount: 1000,
    dailyReturn: "10%",
    duration: 60,
    description: "Maximum staking rewards for elite users",
  },
]

export function StakingPlans() {
  return (
    <section className="py-16 px-4" id="staking">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-block">
            <span className="text-4xl block mb-4 animate-pulse">🚀</span>
            <h2 className="text-3xl md:text-4xl font-bold text-tronmax-green mb-4 font-mono">
              Maximize Your TRX Returns
            </h2>
            <div className="h-1 bg-gradient-to-r from-transparent via-tronmax-green to-transparent max-w-sm mx-auto mb-4"></div>
            <p className="text-lg text-gray-300">Choose Your Staking Strategy</p>
          </div>
        </div>

        {/* Staking Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stakingPlans.map((plan, index) => (
            <Card
              key={plan.name}
              className="bg-gray-900/50 border-gray-700 hover:border-tronmax-green/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-tronmax-green/20"
            >
              <CardHeader className="text-center">
                <CardTitle className="text-xl font-bold text-tronmax-green font-mono">{plan.name}</CardTitle>
                <CardDescription className="text-gray-400">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-white">{plan.amount} TRX</div>
                  <div className="text-tronmax-green font-semibold">{plan.dailyReturn} daily</div>
                  <div className="text-gray-300">{plan.duration} days</div>
                </div>

                <div className="pt-4">
                  <Button
                    className="w-full bg-tronmax-green hover:bg-tronmax-green/80 text-black font-bold transition-all duration-300 hover:shadow-lg hover:shadow-tronmax-green/30"
                    size="lg"
                  >
                    Start Staking
                  </Button>
                </div>

                <div className="text-xs text-gray-500 pt-2">
                  Total Return:{" "}
                  {(
                    ((plan.amount * Number.parseFloat(plan.dailyReturn.replace("%", ""))) / 100) * plan.duration +
                    plan.amount
                  ).toFixed(2)}{" "}
                  TRX
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-gray-300 mb-4">Ready to start staking? Join thousands of users earning daily returns.</p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-tronmax-green to-green-400 hover:from-tronmax-green/80 hover:to-green-300 text-black font-bold px-8 py-3 transition-all duration-300 hover:shadow-lg hover:shadow-tronmax-green/30"
          >
            Get Started Now
          </Button>
        </div>
      </div>
    </section>
  )
}
