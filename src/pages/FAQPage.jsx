import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

const SECTIONS = [
  {
    title: 'General',
    items: [
      {
        q: 'What is PeptideForge?',
        a: 'PeptideForge is a professional peptide synthesis and R&D consulting platform. We supply research-grade custom peptides to universities, biotech companies, and pharmaceutical firms worldwide.',
      },
      {
        q: 'What types of peptides do you offer?',
        a: 'We offer custom-synthesized peptides across all major categories: research peptides, cosmetic/anti-aging peptides, performance peptides, nootropic peptides, therapeutic-grade sequences, and fully custom sequences to your specifications.',
      },
      {
        q: 'What purity levels do you guarantee?',
        a: 'All peptides are synthesized to a minimum of 99%+ purity, verified by HPLC (High-Performance Liquid Chromatography) and mass spectrometry analysis. Certificates of Analysis (CoA) are available upon request.',
      },
      {
        q: 'Is there a minimum order quantity (MOQ)?',
        a: 'No strict MOQ — we work with orders from small research quantities (1–5 mg) up to bulk commercial scale. Pricing scales with quantity. Contact us for a custom quote.',
      },
      {
        q: 'Do you offer R&D consulting?',
        a: 'Yes. Our team of PhD-level scientists provides consulting on peptide design, sequence optimization, modification strategies, and application guidance. Reach out via the Contact page.',
      },
    ],
  },
  {
    title: 'Orders & Payment',
    items: [
      {
        q: 'How do I place an order?',
        a: 'Browse the catalog, add items to your cart, and proceed to checkout. At checkout you select your payment method and send your order to our team via WhatsApp or email. We confirm your order and reply with payment details.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept Bitcoin (BTC), Tether (USDT), Ethereum (ETH), and CashApp. Wallet addresses and CashApp tags are sent privately by our team after you submit your order — no addresses are displayed on the website.',
      },
      {
        q: 'When will I receive the wallet address?',
        a: 'After you submit your order via WhatsApp or email, our team will reply within a few hours with the exact wallet address (or CashApp tag) for your chosen payment method. We do not display wallet addresses publicly.',
      },
      {
        q: 'Do I need to send proof of payment?',
        a: 'Yes — always. After completing your transfer, send us your transaction ID or a payment screenshot via WhatsApp or email. Your order is not confirmed and synthesis does not begin until proof of payment is received.',
      },
      {
        q: 'Can I get a custom quote before ordering?',
        a: 'Absolutely. Use the "Request a Quote" button on any product page, or send a message through the Contact page. We typically respond within 24 hours with a detailed quote.',
      },
    ],
  },
  {
    title: 'Shipping & Delivery',
    items: [
      {
        q: 'Where do you ship to?',
        a: 'We ship to 50+ countries worldwide. Availability may vary by destination due to local import regulations. Contact us if you\'re unsure whether we ship to your country.',
      },
      {
        q: 'How long does delivery take?',
        a: 'Synthesis typically takes 2–3 weeks from order confirmation. Shipping time varies by destination — generally 3–7 business days internationally via express courier.',
      },
      {
        q: 'Do you use cold-chain shipping?',
        a: 'Yes. All peptides are shipped with cold-chain logistics including dry ice or ice packs where required to preserve peptide integrity during transit.',
      },
      {
        q: 'Are there customs or import fees?',
        a: 'Customs duties and import fees are the responsibility of the buyer and vary by country. We label shipments accurately with appropriate documentation. Contact us if you have specific customs concerns for your region.',
      },
    ],
  },
  {
    title: 'Legal & Safety',
    items: [
      {
        q: 'Are your peptides for research use only?',
        a: 'Yes. All peptides sold by PeptideForge are strictly for laboratory and scientific research purposes only. They are not intended for human or animal consumption, therapeutic use, or any non-research application.',
      },
      {
        q: 'Are your products FDA approved?',
        a: 'No. Our peptides are research chemicals and are not FDA approved for any medical or clinical use. They are not drugs, supplements, or treatments.',
      },
      {
        q: 'Is there an age restriction?',
        a: 'Yes. You must be at least 18 years old and a qualified researcher, scientist, or licensed professional to purchase from PeptideForge. By placing an order, you confirm you meet these requirements.',
      },
      {
        q: 'Where can I read your full disclaimer?',
        a: null,
        link: { label: 'Read our full Disclaimer →', to: '/disclaimer' },
      },
    ],
  },
]

function FAQItem({ item }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
      >
        <span className="font-medium text-gray-900 dark:text-white text-sm pr-4">{item.q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 text-gray-400"
        >
          <ChevronDownIcon className="h-5 w-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {item.a}
              {item.link && (
                <Link to={item.link.to} className="block mt-2 text-primary font-medium hover:underline">
                  {item.link.label}
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Frequently Asked Questions</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Everything you need to know about ordering, payment, shipping, and our peptides.
        </p>
      </div>

      <div className="space-y-10">
        {SECTIONS.map(section => (
          <div key={section.title}>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-primary rounded-full inline-block" />
              {section.title}
            </h2>
            <div className="space-y-2">
              {section.items.map(item => (
                <FAQItem key={item.q} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-14 text-center bg-gradient-to-r from-primary to-accent rounded-2xl p-10 text-white">
        <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
        <p className="text-primary-100 text-sm mb-6">Our team responds within 24 hours.</p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 bg-white text-primary px-7 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors text-sm"
        >
          Contact Us
        </Link>
      </div>
    </div>
  )
}
