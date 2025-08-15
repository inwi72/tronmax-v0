import { type NextRequest, NextResponse } from "next/server"
import { RateLimiterMemory } from "rate-limiter-flexible"

// Rate limiter for CAPTCHA requests
const captchaLimiter = new RateLimiterMemory({
  keyGenerator: (req: NextRequest) => req.ip || "unknown",
  points: 10, // Number of CAPTCHA requests
  duration: 3600, // Per hour
})

// Simple math CAPTCHA generator
function generateMathCaptcha() {
  const num1 = Math.floor(Math.random() * 10) + 1
  const num2 = Math.floor(Math.random() * 10) + 1
  const operators = ["+", "-", "*"]
  const operator = operators[Math.floor(Math.random() * operators.length)]

  let answer: number
  let question: string

  switch (operator) {
    case "+":
      answer = num1 + num2
      question = `${num1} + ${num2}`
      break
    case "-":
      answer = Math.max(num1, num2) - Math.min(num1, num2)
      question = `${Math.max(num1, num2)} - ${Math.min(num1, num2)}`
      break
    case "*":
      answer = num1 * num2
      question = `${num1} × ${num2}`
      break
    default:
      answer = num1 + num2
      question = `${num1} + ${num2}`
  }

  return { question, answer }
}

export async function GET(request: NextRequest) {
  try {
    await captchaLimiter.consume(request.ip || "unknown")

    const captcha = generateMathCaptcha()
    const captchaId = Date.now().toString() + Math.random().toString(36).substr(2, 9)

    // Store CAPTCHA answer temporarily (in production, use Redis or database)
    global.captchaStore = global.captchaStore || new Map()
    global.captchaStore.set(captchaId, {
      answer: captcha.answer,
      expires: Date.now() + 300000, // 5 minutes
    })

    return NextResponse.json({
      captchaId,
      question: captcha.question,
    })
  } catch (error) {
    return NextResponse.json({ error: "Too many CAPTCHA requests" }, { status: 429 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { captchaId, answer } = await request.json()

    if (!captchaId || answer === undefined) {
      return NextResponse.json({ error: "Missing captcha data" }, { status: 400 })
    }

    global.captchaStore = global.captchaStore || new Map()
    const storedCaptcha = global.captchaStore.get(captchaId)

    if (!storedCaptcha) {
      return NextResponse.json({ error: "Invalid or expired CAPTCHA" }, { status: 400 })
    }

    if (Date.now() > storedCaptcha.expires) {
      global.captchaStore.delete(captchaId)
      return NextResponse.json({ error: "CAPTCHA expired" }, { status: 400 })
    }

    const isCorrect = Number.parseInt(answer) === storedCaptcha.answer
    global.captchaStore.delete(captchaId)

    return NextResponse.json({ valid: isCorrect })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
