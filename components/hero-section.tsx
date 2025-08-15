import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative">
      {/* Banner background */}
      <div
        className="h-64 bg-cover bg-center bg-no-repeat mb-8"
        style={{
          backgroundImage:
            "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tronmax-banner.jpg-ar30CiyRnbYqB5kJn9KjeEeDl6zuWh.jpeg')",
        }}
      />

      <div className="max-w-4xl mx-auto mb-10 p-8 bg-gradient-to-br from-black/90 to-gray-900/90 border border-tronmax-green rounded-xl text-center shadow-2xl shadow-tronmax-green/20 animate-fade-in-up">
        <h1 className="text-5xl md:text-6xl font-bold mb-8 text-transparent bg-gradient-to-r from-tronmax-green to-green-400 bg-clip-text font-mono">
          WIN FREE TRX EVERY HOUR!
        </h1>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-8 text-left">
          <div className="flex items-center space-x-3 p-3 bg-black/50 rounded-lg border border-tronmax-green/30">
            <div className="text-green-400 text-xl">✅</div>
            <span className="text-lg font-semibold text-white">WIN UP TO $100 IN FREE TRX</span>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-black/50 rounded-lg border border-tronmax-green/30">
            <div className="text-green-400 text-xl">✅</div>
            <span className="text-lg font-semibold text-white">MULTIPLY YOUR TRX PLAYING HI-LO</span>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-black/50 rounded-lg border border-tronmax-green/30">
            <div className="text-green-400 text-xl">✅</div>
            <span className="text-lg font-semibold text-white">FREE WEEKLY LOTTERY WITH BIG PRIZES</span>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-black/50 rounded-lg border border-tronmax-green/30">
            <div className="text-green-400 text-xl">✅</div>
            <span className="text-lg font-semibold text-white">TRX SAVINGS ACCOUNT WITH DAILY INTEREST</span>
          </div>
        </div>

        {/* Referral Feature - Full Width */}
        <div className="flex items-center justify-center space-x-3 p-4 mb-8 bg-gradient-to-r from-tronmax-green/20 to-green-900/30 rounded-lg border border-tronmax-green/50">
          <div className="text-green-400 text-xl">✅</div>
          <span className="text-xl font-bold text-tronmax-green">50% REFERRAL COMMISSIONS FOR LIFE</span>
        </div>

        {/* CTA Button */}
        <Link
          href="/register"
          className="inline-block px-12 py-4 bg-gradient-to-r from-tronmax-green to-green-400 text-black font-bold text-xl rounded-lg hover:from-tronmax-green-hover hover:to-green-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-tronmax-green/50 transition-all duration-300 transform"
        >
          START NOW
        </Link>

        <p className="text-sm text-gray-400 mt-4">Join thousands of users earning free TRX daily!</p>
      </div>
    </section>
  )
}
