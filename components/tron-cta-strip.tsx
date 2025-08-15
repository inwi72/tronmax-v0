"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"

export function TronCTAStrip() {
  const [isVisible, setIsVisible] = useState(false)
  const stripRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (stripRef.current) {
      observer.observe(stripRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={stripRef}
      className={`relative bg-[#0d0d0d] py-20 px-4 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{
        backgroundImage: `
          linear-gradient(90deg, rgba(239, 68, 68, 0.1) 1px, transparent 1px),
          linear-gradient(rgba(239, 68, 68, 0.1) 1px, transparent 1px),
          linear-gradient(45deg, rgba(239, 68, 68, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: "50px 50px, 50px 50px, 25px 25px",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-red-500/5"></div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">Start Earning TRX Now</h2>

        <p className="text-gray-400 text-xl md:text-2xl mb-12 max-w-3xl mx-auto">
          Join thousands already growing their TRON balance with TRONMAX.
        </p>

        <Link href="/auth/register">
          <button className="group relative inline-flex items-center justify-center px-16 py-6 text-2xl font-bold text-white bg-transparent rounded-2xl border-2 border-red-500 overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-red-500/10">
            <div className="absolute inset-0 bg-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            <div className="absolute inset-0 border-2 border-red-500 rounded-2xl shadow-[0_0_20px_rgba(239,68,68,0.5)] group-hover:shadow-[0_0_30px_rgba(239,68,68,0.8)] transition-all duration-300"></div>

            {/* Button content */}
            <span className="relative z-10">Get Started</span>
          </button>
        </Link>
      </div>
    </section>
  )
}
