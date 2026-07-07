import { useState } from 'react'
import { useCart } from '../store/CartContext'
import { useSettings } from '../hooks/useSettings'
import Modal from './ui/Modal'
import { BeakerIcon, CheckIcon } from '@heroicons/react/24/outline'
import { WhatsAppLogo, GmailLogo } from './icons/BrandIcons'

const PAYMENT_METHODS = [
  {
    id: 'btc',
    label: 'Bitcoin',
    symbol: 'BTC',
    icon: (
      <svg viewBox="0 0 32 32" className="h-6 w-6 fill-current">
        <path d="M16 0C7.163 0 0 7.163 0 16s7.163 16 16 16 16-7.163 16-16S24.837 0 16 0zm3.75 14.094c.375-2.5-1.531-3.844-4.125-4.719l.844-3.375-2.063-.516-.813 3.281c-.547-.137-1.094-.266-1.641-.391l.813-3.297-2.063-.516-.844 3.375c-.453-.109-.906-.219-1.344-.328l.003-.012-2.844-.703-.547 2.203s1.531.344 1.5.375c.844.203.984.75.969 1.187l-.984 3.938c.063.016.141.031.219.063l-.219-.063-1.375 5.5c-.094.25-.344.625-.906.469.016.031-1.5-.375-1.5-.375l-1.031 2.344 2.688.672c.5.125.984.25 1.469.375l-.859 3.422 2.063.516.844-3.406c.562.156 1.109.297 1.641.422l-.828 3.375 2.063.516.859-3.422c3.5.672 6.156.406 7.25-2.766.891-2.547-.047-4.016-1.875-4.969 1.344-.313 2.344-1.203 2.609-3.031zm-4.609 6.469c-.625 2.547-4.875.969-6.25.594l1.125-4.484c1.375.344 5.781 1.031 5.125 3.891zm.625-6.5c-.578 2.328-4.094 1.141-5.234.859l1.016-4.078c1.141.281 4.844.813 4.219 3.219z"/>
      </svg>
    ),
    color: 'text-orange-500',
    border: 'border-orange-300 dark:border-orange-700',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    ring: 'ring-2 ring-orange-400',
  },
  {
    id: 'usdt',
    label: 'USDT',
    symbol: 'Tether',
    icon: (
      <svg viewBox="0 0 32 32" className="h-6 w-6 fill-current">
        <path d="M16 0C7.163 0 0 7.163 0 16s7.163 16 16 16 16-7.163 16-16S24.837 0 16 0zm8 10.4h-4.8V8H12.8v2.4H8l1.6 4h2.4v.4c0 2.163 1.837 4 4 4s4-1.837 4-4v-.4h2.4L24 10.4zm-8 6.4c-1.325 0-2.4-1.075-2.4-2.4v-.4h4.8v.4c0 1.325-1.075 2.4-2.4 2.4zm0 5.6c-2.65 0-4.8-.35-4.8-.8s2.15-.8 4.8-.8 4.8.35 4.8.8-.15.8-4.8.8z"/>
      </svg>
    ),
    color: 'text-emerald-600',
    border: 'border-emerald-300 dark:border-emerald-700',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    ring: 'ring-2 ring-emerald-400',
  },
  {
    id: 'eth',
    label: 'Ethereum',
    symbol: 'ETH',
    icon: (
      <svg viewBox="0 0 32 32" className="h-6 w-6 fill-current">
        <path d="M16 0C7.163 0 0 7.163 0 16s7.163 16 16 16 16-7.163 16-16S24.837 0 16 0zm-.5 6l.5-.5.5.5 5.5 9-6 3.5-6-3.5 5.5-9zM16 21.5l6-3.5-6 8-6-8 6 3.5z"/>
      </svg>
    ),
    color: 'text-purple-600',
    border: 'border-purple-300 dark:border-purple-700',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    ring: 'ring-2 ring-purple-400',
  },
  {
    id: 'cashapp',
    label: 'CashApp',
    symbol: '$Cashtag',
    icon: (
      <svg viewBox="0 0 32 32" className="h-6 w-6 fill-current">
        <path d="M16 0C7.163 0 0 7.163 0 16s7.163 16 16 16 16-7.163 16-16S24.837 0 16 0zm2.5 22.5l-.5 1.5h-3l-.5-1.5c-2.5-.5-4-2-4-4h3c0 1 .5 1.5 2 1.5s2-.5 2-1.5c0-1-1-1.5-2.5-2-2.5-.75-4-2-4-4 0-2 1.5-3.5 4-4L15.5 7h3l.5 1.5c2 .5 3.5 2 3.5 4h-3c0-1-.5-1.5-2-1.5s-2 .5-2 1.5.75 1.25 2.5 1.75c2.5.75 4 2 4 4.25 0 2.25-1.5 3.75-4 4z"/>
      </svg>
    ),
    color: 'text-green-600',
    border: 'border-green-300 dark:border-green-700',
    bg: 'bg-green-50 dark:bg-green-900/20',
    ring: 'ring-2 ring-green-400',
  },
]

export default function CheckoutModal({ isOpen, onClose }) {
  const { items, total, count, clearCart } = useCart()
  const { settings } = useSettings()
  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState(null)
  const [sent, setSent] = useState(false)

  const pm = PAYMENT_METHODS.find(p => p.id === paymentMethod)

  const handleClose = () => {
    onClose()
    setTimeout(() => { setStep(1); setPaymentMethod(null); setSent(false) }, 300)
  }

  const buildMessage = () => {
    const lines = [
      `🛒 *New Order — PeptideForge*`,
      ``,
      `📦 *Items (${count}):*`,
      ...items.map(({ product, qty }) => {
        const lineTotal = product.price_usd ? ` — $${(parseFloat(product.price_usd) * qty).toFixed(2)}` : ''
        const unit = product.unit ? ` (${product.unit})` : ''
        return `   • ${product.name}${unit} × ${qty}${lineTotal}`
      }),
      ``,
      `💰 *Order Total: $${total.toFixed(2)} USD*`,
      ``,
      `💳 *Payment: ${pm?.label} (${pm?.symbol})*`,
      `   Please send the ${pm?.symbol} wallet address to complete payment.`,
      ``,
      `⏰ ${new Date().toLocaleString()}`,
      `🌐 PeptideForge`,
    ]
    return lines.join('\n')
  }

  const handleSend = (method) => {
    const message = buildMessage()

    if (method === 'whatsapp') {
      const phone = (settings?.whatsapp_number || '19128086267').replace(/\D/g, '')
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank')
    } else {
      const email = settings?.company_email || 'jeffharley461@gmail.com'
      const subject = `New Order (${count} item${count !== 1 ? 's' : ''}) — PeptideForge`
      const body = message
        .replace(/\*/g, '')
        .replace(/[🛒📦💰💳⏰🌐]/gu, '')
        .replace(/^\s+/gm, '')
        .trim()
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    }

    clearCart()
    setSent(true)
  }

  if (sent) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="" size="sm">
        <div className="text-center py-6">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckIcon className="h-10 w-10 text-green-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Order Sent!</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 max-w-xs mx-auto">
            Your order has been sent to the seller via {pm?.label}.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-xs mx-auto">
            They will reply with the{' '}
            <span className="font-semibold text-gray-700 dark:text-gray-200">{pm?.symbol}</span>{' '}
            wallet address to complete your payment.
          </p>
          <button onClick={handleClose} className="btn-primary w-full py-3 rounded-xl font-semibold">
            Continue Shopping
          </button>
        </div>
      </Modal>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Checkout" size="md">
      {/* 2-step indicator */}
      <div className="flex items-center mb-6">
        {['Review Order', 'Payment'].map((label, i) => (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2 shrink-0">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step > i + 1
                  ? 'bg-green-500 text-white'
                  : step === i + 1
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
              }`}>
                {step > i + 1 ? <CheckIcon className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`text-xs font-medium whitespace-nowrap ${step === i + 1 ? 'text-primary' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
            {i < 1 && (
              <div className={`flex-1 h-px mx-3 ${step > i + 1 ? 'bg-green-400' : 'bg-gray-200 dark:bg-gray-700'}`} />
            )}
          </div>
        ))}
      </div>

      {/* ── Step 1: Order Review ── */}
      {step === 1 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Your Order ({count} item{count !== 1 ? 's' : ''})
          </h3>

          <div className="space-y-2 mb-4 max-h-60 overflow-y-auto pr-1">
            {items.map(({ product, qty }) => (
              <div key={product.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {product.image_url
                    ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    : <BeakerIcon className="h-5 w-5 text-primary/40" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{product.name}</p>
                  <p className="text-xs text-gray-400">
                    {product.unit ? `${product.unit} · ` : ''}Qty: {qty}
                  </p>
                </div>
                <p className="text-sm font-bold text-primary flex-shrink-0">
                  {product.price_usd
                    ? `$${(parseFloat(product.price_usd) * qty).toFixed(2)}`
                    : <span className="text-gray-400 text-xs font-normal">Quote</span>
                  }
                </p>
              </div>
            ))}
          </div>

          {/* Totals block */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-5 space-y-2.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
              <span className="font-medium text-gray-700 dark:text-gray-200">${total.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Shipping</span>
              <span className={total >= 500 ? 'font-semibold text-green-500' : 'font-medium text-gray-700 dark:text-gray-200'}>
                {total >= 500 ? 'FREE' : '$30.00'}
              </span>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-2.5 flex items-center justify-between">
              <span className="font-bold text-gray-900 dark:text-white">Total</span>
              <span className="text-xl font-bold text-primary">
                ${(total >= 500 ? total : total + 30).toFixed(2)}
                <span className="text-xs font-normal text-gray-400 ml-1">USD</span>
              </span>
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full btn-primary py-3.5 rounded-xl font-semibold text-sm"
          >
            Choose Payment Method →
          </button>
        </div>
      )}

      {/* ── Step 2: Payment + Send ── */}
      {step === 2 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">How would you like to pay?</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
            After placing your order, the seller will send you the wallet address.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-5">
            {PAYMENT_METHODS.map(method => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === method.id
                    ? `${method.border} ${method.bg} ${method.ring}`
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                }`}
              >
                {paymentMethod === method.id && (
                  <span className={`absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center ${method.bg} ${method.color} border ${method.border}`}>
                    <CheckIcon className="h-3 w-3" />
                  </span>
                )}
                <span className={method.color}>{method.icon}</span>
                <span className="text-xs font-bold text-gray-800 dark:text-gray-100">{method.label}</span>
                <span className="text-xs text-gray-400">{method.symbol}</span>
              </button>
            ))}
          </div>

          {/* Mini order recap */}
          <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 px-1 mb-4">
            <span>{count} item{count !== 1 ? 's' : ''}</span>
            <span className="font-semibold text-gray-600 dark:text-gray-300">
              Total ${(total >= 500 ? total : total + 30).toFixed(2)} USD
            </span>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 mb-4" />

          <p className="text-xs text-center mb-3 text-gray-500 dark:text-gray-400">
            {paymentMethod
              ? 'Contact the seller to place your order:'
              : 'Select a payment method above to continue'
            }
          </p>

          {/* Send to seller buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSend('whatsapp')}
              disabled={!paymentMethod}
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <WhatsAppLogo className="h-5 w-5 flex-shrink-0" />
              WhatsApp
            </button>
            <button
              onClick={() => handleSend('email')}
              disabled={!paymentMethod}
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-700 text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <GmailLogo className="h-5 w-5 flex-shrink-0" />
              Email
            </button>
          </div>

          <button
            onClick={() => setStep(1)}
            className="w-full mt-3 py-2.5 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            ← Back to Order
          </button>
        </div>
      )}
    </Modal>
  )
}
