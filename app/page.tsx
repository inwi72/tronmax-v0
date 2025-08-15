import { CryptoTicker } from "@/components/crypto-ticker"
import { HeroSection } from "@/components/hero-section"
import { StatsSection } from "@/components/stats-section"
import { BackgroundParticles } from "@/components/background-particles"
import { StakingPlans } from "@/components/staking-plans"
import { FAQSection } from "@/components/faq-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { TronCTAStrip } from "@/components/tron-cta-strip"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white relative">
      <BackgroundParticles />
      <CryptoTicker />
      <HeroSection />
      <StatsSection />
      <StakingPlans />
      <FAQSection />
      <TestimonialsSection />
      <TronCTAStrip />
    </main>
  )
}
