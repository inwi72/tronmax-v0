<?php
// Security: Set HTTP headers at the beginning
header("X-Frame-Options: SAMEORIGIN");
header("X-Content-Type-Options: nosniff");
header("Content-Security-Policy: default-src 'self'; script-src 'self' https://api.coingecko.com 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.coingecko.com;");

// Escape output function to prevent XSS
function e($value) {
    return htmlspecialchars($value, ENT_QUOTES | ENT_HTML5, 'UTF-8', false);
}

// Database values (in real application, these should come from prepared statements)
$total_users = 123;
$total_claims = 456;
$total_invested = 7890.50;
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="description" content="TronMax - TRX Faucet & Investment Platform">
  <title>TronMax | TRX Faucet & Investment Platform</title>
  
  <!-- Preconnect to external domains -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://api.coingecko.com">
  
  <!-- Load fonts with performance optimization -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500&display=swap" media="print" onload="this.media='all'">
  
  <style>
    /* ALL ORIGINAL STYLES PRESERVED */
    .faq-section {
      max-width: 900px;
      margin: 40px auto;
      padding: 0 20px;
    }

    .faq-section h2 {
      color: #00ffd5;
      text-align: center;
      margin-bottom: 20px;
    }

    .faq-item {
      background: #111;
      border: 1px solid #333;
      border-radius: 8px;
      margin-bottom: 10px;
      overflow: hidden;
    }

    .faq-question {
      padding: 15px;
      cursor: pointer;
      background: #1a1a1a;
      color: #00ffd5;
      font-weight: bold;
    }

    .faq-answer {
      padding: 15px;
      display: none;
      color: #ccc;
      background: #222;
    }

    .faq-item.active .faq-answer {
      display: block;
    }

    body {
      margin: 0;
      font-family: 'Orbitron', sans-serif;
      background: #000;
      color: #f5f5f5;
    }

    #bg-particles {
      position: fixed;
      top: 0; left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.07;
    }

    nav {
      background: #000;
      padding: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #00ffd5;
    }
    nav ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      gap: 20px;
    }
    nav ul li {
      display: inline;
    }
    nav a {
      color: #00ffd5;
      text-decoration: none;
      font-weight: bold;
    }
<nav>
  <ul>
    <li><a href="index.php">🏠 Home</a></li>
    <li><a href="#plans">💼 Plans</a></li>
    <li><a href="faucet.php">💧 Faucet</a></li>
    <li><a href="dashboard.php">📊 Dashboard</a></li>
  </ul>
  <!-- ... language selector ... -->
</nav>
    .language {
      margin-left: auto;
    }

    .language select {
      background: #222;
      color: #00ffd5;
      border: 1px solid #333;
      padding: 5px;
      font-family: 'Orbitron', sans-serif;
    }

    .crypto-ticker {
      background: #111;
      overflow: hidden;
      border-top: 1px solid #00ffd5;
      border-bottom: 1px solid #00ffd5;
    }

    .ticker-wrapper {
      display: inline-block;
      white-space: nowrap;
      padding: 10px 0;
      animation: scroll-left 20s linear infinite;
      font-size: 14px;
      color: #00ffd5;
    }

    @keyframes scroll-left {
      0% { transform: translateX(100%); }
      100% { transform: translateX(-100%); }
    }

    .banner {
      position: relative;
      background: url('assets/tronmax-banner.jpg') no-repeat center center;
      background-size: cover;
      height: 260px;
      margin-bottom: 30px;
    }

    .cta-container {
      max-width: 600px;
      margin: 0 auto 40px;
      padding: 30px;
      background: rgba(0, 0, 0, 0.85);
      border: 1px solid #00ffd5;
      border-radius: 10px;
      text-align: center;
      box-shadow: 0 0 20px rgba(0, 255, 213, 0.3);
      animation: fadeInUp 1.5s ease-out;
    }

    .cta-container h1 {
      font-size: 2.5rem;
      margin: 0 0 10px;
      color: #00ffd5;
    }

    .cta-container p {
      font-size: 1.1rem;
      margin: 0 0 25px;
      color: #ccc;
    }

    .cta-container a {
      padding: 12px 30px;
      background: #00ffd5;
      color: #000;
      text-decoration: none;
      font-weight: bold;
      border-radius: 5px;
      transition: all 0.3s ease;
      display: inline-block;
    }

    .cta-container a:hover {
      background: #0ff;
      transform: translateY(-3px);
      box-shadow: 0 5px 15px rgba(0, 255, 213, 0.4);
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .stats {
      text-align: center;
      padding: 20px;
      color: #ccc;
      margin-bottom: 30px;
    }

    .plans {
      max-width: 1100px;
      margin: 30px auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
      padding: 0 20px;
    }

    .plan {
      background: #1a1a1a;
      border: 1px solid #333;
      border-radius: 10px;
      padding: 20px;
      text-align: center;
      transition: transform 0.3s ease;
    }

    .plan:hover {
      transform: translateY(-5px);
    }

    .plan h3 {
      color: #00ffd5;
    }

    footer {
      background: #111;
      text-align: center;
      padding: 30px 20px;
      margin-top: 50px;
      border-top: 1px solid #333;
    }

    footer a {
      color: #888;
      margin: 0 10px;
      font-size: 13px;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    footer a:hover {
      color: #00ffd5;
    }

    .footer-links {
      margin-bottom: 15px;
    }

    .plans-section {
      max-width: 1200px;
      margin: 50px auto;
      padding: 0 20px;
    }

    .section-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .section-title {
      position: relative;
      display: inline-block;
    }

    .section-title h2 {
      font-size: 2.5rem;
      color: #00ffd5;
      margin: 10px 0;
      text-shadow: 0 0 10px rgba(0, 255, 213, 0.3);
    }

    .title-icon {
      font-size: 2rem;
      display: block;
      margin-bottom: 10px;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }

    .title-divider {
      height: 3px;
      background: linear-gradient(90deg, transparent, #00ffd5, transparent);
      margin: 15px auto;
      max-width: 300px;
    }

    .section-subtitle {
      color: #ccc;
      font-size: 1.1rem;
      margin-top: 10px;
    }

    @media (max-width: 768px) {
      .banner {
        height: 200px;
        margin-bottom: 20px;
      }
      
      .cta-container {
        padding: 20px;
        margin: 0 auto 30px;
      }
      
      .cta-container h1 {
        font-size: 2rem;
      }
      
      .plans {
        grid-template-columns: 1fr;
      }
      
      .section-title h2 {
        font-size: 2rem;
      }
      
      .section-subtitle {
        font-size: 1rem;
      }
    }

    @media (max-width: 480px) {
      .cta-container {
        margin: 0 15px 25px;
      }
      
      .cta-container h1 {
        font-size: 1.8rem;
      }
      
      .cta-container p {
        font-size: 1rem;
      }
      
      .cta-container a {
        padding: 10px 20px;
      }
    }
  </style>
</head>
<body>

<canvas id="bg-particles"></canvas>

<nav>
  <ul>
    <li><a href="index.php">🏠 Home</a></li>
    <li><a href="faucet.php">💧 Faucet</a></li>
    <!-- Add this line: -->
    <li><a href="staking.php">💰 Staking</a></li>
    <!-- ... other links ... -->
  </ul>
</nav>
  <div class="language">
    <form method="get" id="langForm">
      <select name="lang" id="langSelect">
        <option value="en">🌐 English</option>
        <option value="fr">Français</option>
        <option value="es">Español</option>
      </select>
    </form>
  </div>
</nav>

<div class="crypto-ticker">
  <div class="ticker-wrapper" id="ticker">🔄 Loading prices...</div>
</div>

<div class="banner"></div>

<div class="cta-container">
  <h1>🚀 TronMax</h1>
  <p>Claim TRX. Invest Smart. Earn Fast.</p>
  <a href="register.php">Start Now</a>
</div>

<section class="stats">
  <p>👥 Registered Users: <strong><?php echo e($total_users); ?></strong></p>
  <p>💧 Total Claims: <strong><?php echo e($total_claims); ?></strong></p>
  <p>💸 Total Invested: <strong><?php echo e(number_format($total_invested, 2)); ?> TRX</strong></p>
</section>

<section class="plans-section" id="plans">
  <div class="section-header">
    <div class="section-title">
      <span class="title-icon">🚀</span>
      <h2>Maximize Your TRX Returns</h2>
      <div class="title-divider"></div>
      <p class="section-subtitle">Choose Your Investment Strategy</p>
    </div>
  </div>

  <div class="plans">
    <div class="plan"><h3>Starter Pack</h3><p>5 TRX • 0.01% daily • 7 days</p></div>
    <div class="plan"><h3>Beginner Boost</h3><p>10 TRX • 0.1% daily • 10 days</p></div>
    <div class="plan"><h3>Smart Choice</h3><p>50 TRX • 1% daily • 15 days</p></div>
    <div class="plan"><h3>Growth Mode</h3><p>100 TRX • 5% daily • 30 days</p></div>
    <div class="plan"><h3>Pro Investor</h3><p>500 TRX • 7% daily • 45 days</p></div>
    <div class="plan"><h3>Elite Max</h3><p>1000 TRX • 10% daily • 60 days</p></div>
  </div>
</section>

<section class="faq-section" id="faq">
  <h2> Frequently Asked Questions❓</h2>

  <div class="faq-item">
    <div class="faq-question">🤖 How does TronMax work?</div>
    <div class="faq-answer">You can claim TRX from our faucet or invest in plans to earn daily returns. Just register, login, and start!</div>
  </div>

  <div class="faq-item">
    <div class="faq-question">💸 Is there a minimum investment?</div>
    <div class="faq-answer">Yes, the minimum starts at just 15 TRX with our Starter Pack.</div>
  </div>

  <div class="faq-item">
    <div class="faq-question">🔐 Is my TRX safe?</div>
    <div class="faq-answer">We use secure APIs and wallets. However, always invest responsibly and read our Terms before proceeding.</div>
  </div>

  <div class="faq-item">
    <div class="faq-question">📤 How do I withdraw?</div>
    <div class="faq-answer">Once you reach the minimum threshold, you can request a withdrawal directly from your dashboard.</div>
  </div>

  <div class="faq-item">
    <div class="faq-question">📱 How can I contact support?</div>
    <div class="faq-answer">Join our <a href="https://t.me/yourchannel" style="color:#00ffd5" target="_blank" rel="noopener noreferrer">Telegram</a> or check the footer links for support options.</div>
  </div>
</section>

<section id="testimonials" style="text-align: center; padding: 40px 20px; background: #0a0a0a;">
  <h2 style="color: #00ffd5; margin-bottom: 20px;"> What Our Users Say</h2>
  <img src="assets/testimonials.png" alt="User Testimonials" loading="lazy" style="max-width: 100%; border-radius: 10px; box-shadow: 0 0 10px #00ffd5;" />
</section>

<footer>
  <div class="footer-links">
    <a href="about.php">About</a> |
    <a href="terms.php">Terms</a> |
    <a href="privacy.php">Privacy</a> |
    <a href="disclaimer.php">Disclaimer</a>
  </div>
  <p>© <?php echo e(date('Y')); ?> TronMax — Built on TRON Blockchain.</p>
</footer>

<script>
  // Load particles.js asynchronously
  function loadParticles() {
    const script = document.createElement('script');
    script.src = 'js/particles.js';
    script.async = true;
    document.body.appendChild(script);
  }

  // Crypto ticker function
  async function loadTicker() {
    const el = document.getElementById('ticker');
    try {
      const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tron,binancecoin,ripple&vs_currencies=usd');
      
      // Validate response
      if (!res.ok) throw new Error('API error');
      
      const data = await res.json();
      const prices = [
        `₿ BTC: $${parseFloat(data.bitcoin.usd).toFixed(2)}`,
        `Ξ ETH: $${parseFloat(data.ethereum.usd).toFixed(2)}`,
        `TRX: $${parseFloat(data.tron.usd).toFixed(4)}`,
        `BNB: $${parseFloat(data.binancecoin.usd).toFixed(2)}`,
        `XRP: $${parseFloat(data.ripple.usd).toFixed(4)}`
      ];
      el.textContent = prices.join(' | ');
    } catch {
      el.textContent = '🔁 Unable to load prices...';
    }
  }

  // FAQ functionality
  function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      question.addEventListener('click', () => {
        item.classList.toggle('active');
      });
    });
  }

  // Language selector
  function initLanguageSelector() {
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
      langSelect.addEventListener('change', () => {
        document.getElementById('langForm').submit();
      });
    }
  }

  // Initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    loadTicker();
    initFAQ();
    initLanguageSelector();
    loadParticles();
    
    // Refresh ticker every minute
    setInterval(loadTicker, 60000);
  });
</script>

</body>
</html>
