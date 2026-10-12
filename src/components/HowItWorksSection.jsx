import { motion } from 'framer-motion'
import { ClipboardDocumentListIcon, CreditCardIcon, TruckIcon } from '@heroicons/react/24/outline'

const STEPS = [
  {
    icon: ClipboardDocumentListIcon,
    title: 'Select Your Peptides',
    desc: 'Browse the catalog with batch and specification data — purity, molecular weight, and COA for every product.',
  },
  {
    icon: CreditCardIcon,
    title: 'Secure Checkout & Flexible Payment',
    desc: 'Order through a secure checkout with flexible payment options including crypto, card, and CashApp.',
  },
  {
    icon: TruckIcon,
    title: 'Tracked Fast Delivery',
    desc: 'Receive your order with discreet, tracked, cold-chain shipping and full documentation.',
  },
]

export default function HowItWorksSection() {
  return (
    <section className="py-20 px-4 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">Simple Process</span>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-2 mb-3">How It Works</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            From selection to delivery in three straightforward steps
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-10 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30" />

          {STEPS.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="relative text-center"
            >
              <div className="relative mx-auto mb-5 w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25">
                <Icon className="h-9 w-9 text-white" />
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white dark:bg-gray-900 border-2 border-primary text-primary text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs mx-auto">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
