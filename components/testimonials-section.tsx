"use client"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Queen",
      username: "@SarahQueen",
      avatar: "/professional-woman-smiling.png",
      quote: "Earning TRX fast is effortless with TronMax. I love it!",
    },
    {
      name: "Crypto Josh",
      username: "@CryptoJosh",
      avatar: "/confident-black-man.png",
      quote: "Reliable and rewarding. TronMax is my go-to investment platform!",
    },
    {
      name: "Maria Rodriguez",
      username: "@CryptoMaria",
      avatar: "/latina-professional-headshot.png",
      quote: "The staking rewards are incredible. Best decision I made this year!",
    },
  ]

  return (
    <section className="bg-black py-20 px-4 border-t border-tronmax-green/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-tronmax-green mb-4">What Our Users Say</h2>
          <p className="text-gray-400 text-lg">Join thousands of satisfied TronMax users earning TRX daily</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gradient-to-b from-gray-900/50 to-black border border-tronmax-green/30 rounded-xl p-8 hover:border-tronmax-green/50 transition-all duration-300"
            >
              <div className="flex items-center mb-6">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full border-2 border-tronmax-green/50 mr-4"
                />
                <div>
                  <h3 className="text-white font-semibold text-lg">{testimonial.name}</h3>
                  <p className="text-tronmax-green text-sm">{testimonial.username}</p>
                </div>
              </div>

              <blockquote className="text-gray-300 text-lg italic leading-relaxed">"{testimonial.quote}"</blockquote>

              <div className="flex text-tronmax-green mt-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center bg-gradient-to-r from-tronmax-green/20 to-tronmax-green/10 rounded-full px-6 py-3 border border-tronmax-green/30">
            <span className="text-tronmax-green font-semibold mr-2">⭐ 4.9/5</span>
            <span className="text-gray-400">from 10,000+ reviews</span>
          </div>
        </div>
      </div>
    </section>
  )
}
