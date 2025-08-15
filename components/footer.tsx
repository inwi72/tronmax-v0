import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 border-t border-gray-700 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-tronmax-green font-bold mb-4 font-mono">TronMax</h3>
            <p className="text-gray-400 text-sm">
              The premier TRX faucet and staking platform built on the TRON blockchain.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <div className="space-y-2">
              <Link href="/faucet" className="block text-gray-400 hover:text-tronmax-green text-sm transition-colors">
                Faucet
              </Link>
              <Link href="#staking" className="block text-gray-400 hover:text-tronmax-green text-sm transition-colors">
                Staking Plans
              </Link>
              <Link
                href="/dashboard"
                className="block text-gray-400 hover:text-tronmax-green text-sm transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <div className="space-y-2">
              <Link href="/about" className="block text-gray-400 hover:text-tronmax-green text-sm transition-colors">
                About
              </Link>
              <Link href="/terms" className="block text-gray-400 hover:text-tronmax-green text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="block text-gray-400 hover:text-tronmax-green text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link
                href="/disclaimer"
                className="block text-gray-400 hover:text-tronmax-green text-sm transition-colors"
              >
                Disclaimer
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Community</h4>
            <div className="space-y-2">
              <Link href="#" className="block text-gray-400 hover:text-tronmax-green text-sm transition-colors">
                Telegram
              </Link>
              <Link href="#" className="block text-gray-400 hover:text-tronmax-green text-sm transition-colors">
                Twitter
              </Link>
              <Link href="#" className="block text-gray-400 hover:text-tronmax-green text-sm transition-colors">
                Discord
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">© {currentYear} TronMax — Built on TRON Blockchain</p>
          <div className="flex space-x-4 text-sm">
            <Link href="/about" className="text-gray-400 hover:text-tronmax-green transition-colors">
              About
            </Link>
            <span className="text-gray-600">|</span>
            <Link href="/terms" className="text-gray-400 hover:text-tronmax-green transition-colors">
              Terms
            </Link>
            <span className="text-gray-600">|</span>
            <Link href="/privacy" className="text-gray-400 hover:text-tronmax-green transition-colors">
              Privacy
            </Link>
            <span className="text-gray-600">|</span>
            <Link href="/disclaimer" className="text-gray-400 hover:text-tronmax-green transition-colors">
              Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
