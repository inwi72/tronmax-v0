"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle, MessageCircle, Mail, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function FAQPage() {
  const faqData = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How does TronMax work?",
          answer:
            "TronMax is a TRX faucet platform where you can claim free TRX every hour, participate in staking plans, play multiply games, and earn through referrals. Simply register, verify your account, and start claiming your free TRX rewards.",
        },
        {
          question: "How often can I claim free TRX?",
          answer:
            "You can claim free TRX every hour. The amount varies based on your account level and current promotions. Higher level accounts receive larger rewards.",
        },
        {
          question: "What is the minimum staking amount?",
          answer:
            "The minimum staking amount varies by plan. Our basic plan starts at 10 TRX, while premium plans require higher amounts but offer better daily returns.",
        },
      ],
    },
    {
      category: "Staking & Rewards",
      questions: [
        {
          question: "How do staking plans work?",
          answer:
            "Our staking plans allow you to deposit TRX for a fixed period and earn daily returns. Returns are automatically credited to your account balance and can be withdrawn or reinvested.",
        },
        {
          question: "When do I receive staking rewards?",
          answer:
            "Staking rewards are calculated and distributed daily at 00:00 UTC. You can view your pending and received rewards in your dashboard.",
        },
        {
          question: "Can I withdraw my staked amount early?",
          answer:
            "Early withdrawal policies depend on the specific staking plan. Some plans allow early withdrawal with penalties, while others require completion of the full term.",
        },
      ],
    },
    {
      category: "Referrals & Commissions",
      questions: [
        {
          question: "How much commission do I earn from referrals?",
          answer:
            "You earn 50% commission for life from all your referrals' activities including faucet claims, staking rewards, and multiply game winnings.",
        },
        {
          question: "How do I refer friends?",
          answer:
            "Share your unique referral link found in the Referrals section. When someone registers using your link and starts earning, you automatically receive commissions.",
        },
        {
          question: "When are referral commissions paid?",
          answer:
            "Referral commissions are credited instantly when your referrals earn rewards. You can track all commission earnings in your dashboard.",
        },
      ],
    },
    {
      category: "Deposits & Withdrawals",
      questions: [
        {
          question: "What is the minimum withdrawal amount?",
          answer:
            "The minimum withdrawal amount is 10 TRX. Withdrawals are processed within 24 hours and require a small network fee.",
        },
        {
          question: "How long do deposits take to confirm?",
          answer:
            "TRX deposits are credited after 1 network confirmation, which typically takes 1-3 minutes on the TRON network.",
        },
        {
          question: "Are there any withdrawal fees?",
          answer: "Yes, there is a small network fee of 1 TRX per withdrawal to cover TRON network transaction costs.",
        },
      ],
    },
    {
      category: "Security & Support",
      questions: [
        {
          question: "Is TronMax safe and secure?",
          answer:
            "Yes, TronMax uses industry-standard security measures including SSL encryption, secure wallet storage, and regular security audits to protect user funds and data.",
        },
        {
          question: "How can I contact support?",
          answer:
            "You can contact our support team through the contact form below, email us directly, or join our Telegram community for quick assistance.",
        },
        {
          question: "What if I forget my password?",
          answer:
            "Use the 'Forgot Password' link on the login page to reset your password. You'll receive a secure reset link via email.",
        },
      ],
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-tronmax-green">Frequently Asked Questions</h1>
          <p className="text-gray-300">Find answers to common questions about TronMax</p>
        </div>

        <div className="space-y-6">
          {faqData.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-tronmax-green flex items-center">
                  <HelpCircle className="w-5 h-5 mr-2" />
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, faqIndex) => (
                    <AccordionItem key={faqIndex} value={`item-${categoryIndex}-${faqIndex}`}>
                      <AccordionTrigger className="text-left text-gray-300 hover:text-tronmax-green">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-400">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Support */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-tronmax-green flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Still Need Help?
            </CardTitle>
            <CardDescription>Can't find what you're looking for? Contact our support team</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="border-tronmax-green text-tronmax-green hover:bg-tronmax-green/10 bg-transparent"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email Support
              </Button>
              <Button
                variant="outline"
                className="border-tronmax-green text-tronmax-green hover:bg-tronmax-green/10 bg-transparent"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Join Telegram
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
