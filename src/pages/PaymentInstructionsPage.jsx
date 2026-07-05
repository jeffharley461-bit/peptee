import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'

const PAYMENT_METHODS = [
  {
    label: 'Bitcoin',
    symbol: 'BTC',
    color: '#F7931A',
    logo: '/payment-logos/BTC.svg',
    fallback: '₿',
  },
  {
    label: 'USDT (Tether)',
    symbol: 'USDT',
    color: '#26A17B',
    logo: '/payment-logos/USDT.svg',
    fallback: '₮',
  },
  {
    label: 'Ethereum',
    symbol: 'ETH',
    color: '#627EEA',
    logo: '/payment-logos/ETH.svg',
    fallback: 'Ξ',
  },
  {
    label: 'CashApp',
    symbol: '$Cashtag',
    color: '#00D632',
    logo: '/payment-logos/CashApp.svg',
    fallback: '$',
  },
]

const STEPS = [
  {
    number: '01',
    title: 'Add products to your cart',
    desc: 'Browse the catalog, add the peptides you need, and adjust quantities in your cart.',
    color: 'bg-primary/10 text-primary border-primary/20',
  },
  {
    number: '02',
    title: 'Choose payment method & send your order',
    desc: 'At checkout, select your preferred payment method (BTC, USDT, ETH, or CashApp) and send your order request to us via WhatsApp or Email.',
    color: 'bg-accent/10 text-accent border-accent/20',
  },
  {
    number: '03',
    title: 'Receive the wallet address',
    desc: 'Our team will reply directly on WhatsApp or Email with the exact wallet address (or CashApp tag) for your chosen payment method.',
    color: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  },
  {
    number: '04',
    title: 'Send payment & share proof',
    desc: 'Transfer the amount to the provided address, then send us proof of payment — a transaction ID or screenshot — via WhatsApp or Email to confirm your order.',
    color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
  },
]

export default function PaymentInstructionsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">How Payment Works</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          Payment is handled directly between you and our team — no wallets are stored on this site.
          Here's exactly how the process works.
        </p>
      </div>

      {/* Step-by-step */}
      <div className="space-y-4 mb-12">
        {STEPS.map(step => (
          <div key={step.number} className="flex gap-4">
            <div className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-sm font-bold flex-shrink-0 ${step.color}`}>
              {step.number}
            </div>
            <div className="pt-2">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{step.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Accepted payment methods — logos only, no addresses */}
      <Card className="mb-8">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Accepted Payment Methods</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {PAYMENT_METHODS.map(pm => (
            <div key={pm.symbol} className="flex flex-col items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: pm.color + '20' }}
              >
                <img
                  src={pm.logo}
                  alt={pm.label}
                  className="w-8 h-8 object-contain"
                  onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'block' }}
                />
                <span className="hidden text-xl font-bold" style={{ color: pm.color }}>{pm.fallback}</span>
              </div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center">{pm.label}</p>
              <p className="text-xs text-gray-400">{pm.symbol}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 text-center">
          Wallet addresses are provided privately by our team after you send your order.
        </p>
      </Card>

      {/* Proof of payment — highlighted box */}
      <div className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current text-primary">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Always send proof of payment</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              After completing your transfer, always send us your <strong>transaction ID</strong> or a <strong>payment screenshot</strong> via WhatsApp or Email.
              This is how we confirm your order and begin processing — your order is not confirmed until proof is received.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Ready to order?</p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 btn-primary px-8 py-3 text-sm font-semibold"
        >
          Browse the Catalog →
        </Link>
      </div>
    </div>
  )
}
