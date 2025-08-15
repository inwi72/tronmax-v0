"use client"

import { useState } from "react"
import { ChevronDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: "How does TronMax work?",
    answer:
      "You can claim TRX from our faucet or stake in plans to earn daily returns. Just register, login, and start earning!",
  },
  {
    question: "Is there a minimum staking amount?",
    answer: "Yes, the minimum starts at just 5 TRX with our Starter Pack staking plan.",
  },
  {
    question: "Is my TRX safe?",
    answer:
      "We use secure APIs and wallets with industry-standard security measures. However, always stake responsibly and read our Terms before proceeding.",
  },
  {
    question: "How do I withdraw my earnings?",
    answer:
      "Once you reach the minimum threshold, you can request a withdrawal directly from your dashboard. Withdrawals are processed within 24-48 hours.",
  },
  {
    question: "How can I contact support?",
    answer:
      "Join our Telegram community or check the footer links for support options. Our team is available 24/7 to help you.",
  },
  {
    question: "What are the staking rewards?",
    answer:
      "Staking rewards vary by plan, ranging from 0.01% to 10% daily returns depending on your chosen staking duration and amount.",
  },
]

export function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <section className="py-16 px-4 bg-gray-900/20" id="faq">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-tronmax-green mb-4 font-mono">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-300">Get answers to common questions about TronMax</p>
        </div>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="bg-gray-900/50 border border-gray-700 rounded-lg overflow-hidden hover:border-tronmax-green/50 transition-colors duration-300"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left bg-gray-800/50 hover:bg-gray-800/70 transition-colors duration-300 flex justify-between items-center"
              >
                <span className="font-semibold text-tronmax-green pr-4">{item.question}</span>
                <ChevronDownIcon
                  className={cn(
                    "w-5 h-5 text-tronmax-green transition-transform duration-300 flex-shrink-0",
                    openItems.includes(index) && "rotate-180",
                  )}
                />
              </button>

              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  openItems.includes(index) ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
                )}
              >
                <div className="px-6 py-4 text-gray-300 bg-gray-800/30">{item.answer}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">Still have questions?</p>
          <button className="px-6 py-2 bg-tronmax-green/10 border border-tronmax-green text-tronmax-green rounded-lg hover:bg-tronmax-green/20 transition-colors duration-300">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  )
}
