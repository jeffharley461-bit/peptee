import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import MarqueeBanner from '../components/MarqueeBanner'
import { useProducts } from '../hooks/useProducts'
import Card from '../components/ui/Card'
import {
  BeakerIcon, SparklesIcon, TruckIcon, ShieldCheckIcon,
  ArrowRightIcon, ChatBubbleLeftEllipsisIcon
} from '@heroicons/react/24/outline'

const CASE_STUDIES = [
  {
    title: 'Anti-Aging Peptide Development',
    category: 'Cosmetic Research',
    summary: 'Developed a novel collagen-stimulating peptide for a leading European skincare brand, achieving 94% purity on first synthesis.',
    result: '94% purity, 3-week delivery',
    color: 'from-blue-500 to-cyan-400',
  },
  {
    title: 'Cancer Biomarker Peptides',
    category: 'Oncology Research',
    summary: 'Synthesized a panel of 12 diagnostic peptides for early-stage cancer detection research at a US university.',
    result: '12 peptides, 99%+ purity each',
    color: 'from-purple-500 to-accent-400',
  },
  {
    title: 'Antimicrobial Peptide Panel',
    category: 'Pharmaceutical R&D',
    summary: 'Custom synthesis of 8 AMPs for antibiotic resistance research, all verified by HPLC and mass spectrometry.',
    result: '8 AMPs, 2-week turnaround',
    color: 'from-emerald-500 to-green-400',
  },
]

const SERVICES = [
  { icon: BeakerIcon,      key: 'synthesis',   color: 'text-primary bg-primary/10' },
  { icon: SparklesIcon,    key: 'consulting',  color: 'text-accent bg-accent/10' },
  { icon: ShieldCheckIcon, key: 'testing',     color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' },
  { icon: TruckIcon,       key: 'delivery',    color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20' },
]

const TESTIMONIALS = [
  {
    quote: "PeptideForge delivered our custom BPC-157 analogue at 99.4% purity in under two weeks. The CoA matched every spec we requested. They're now our go-to synthesis partner.",
    name: 'Dr. Sarah Chen',
    role: 'Research Scientist',
    org: 'MIT Department of Biology',
    initials: 'SC',
    color: 'bg-primary',
  },
  {
    quote: "We ordered a panel of 8 antimicrobial peptides for drug-resistance research. Every batch passed our in-house HPLC validation. Communication was fast and the team clearly understood the science.",
    name: 'Prof. James Okafor',
    role: 'Principal Investigator',
    org: 'University of London',
    initials: 'JO',
    color: 'bg-accent',
  },
  {
    quote: "Fast turnaround, professional documentation, and the peptides performed exactly as expected in our cell assays. I've recommended PeptideForge to three colleagues already.",
    name: 'Dr. Maria Santos',
    role: 'Lead Researcher',
    org: 'BioTech Innovations GmbH',
    initials: 'MS',
    color: 'bg-emerald-500',
  },
  {
    quote: "The R&D consulting service helped us redesign a sequence that wasn't folding correctly. Their team suggested the modification and it worked on the first synthesis. Exceptional.",
    name: 'Dr. Yuki Tanaka',
    role: 'Principal Investigator',
    org: 'Tokyo Institute of Technology',
    initials: 'YT',
    color: 'bg-orange-500',
  },
  {
    quote: "Ordering was straightforward — I added to cart, sent the request via email, and received the wallet address within hours. Payment was smooth and shipment arrived with cold-chain intact.",
    name: 'Thomas Brennan',
    role: 'Senior Lab Technician',
    org: 'Cambridge Research Labs',
    initials: 'TB',
    color: 'bg-pink-500',
  },
  {
    quote: "We needed a cosmetic peptide at scale for a skincare formulation. PeptideForge handled the batch perfectly and even suggested a storage buffer to improve stability. Great partners.",
    name: 'Dr. Aisha Nkosi',
    role: 'Formulation Scientist',
    org: 'Lumière Cosmetics R&D',
    initials: 'AN',
    color: 'bg-cyan-500',
  },
]

const PAYMENT_METHODS = [
  { name: 'Bitcoin',   symbol: 'BTC', logo: '/payment-logos/BTC.svg',    color: '#F7931A' },
  { name: 'Tether',    symbol: 'USDT',logo: '/payment-logos/USDT.svg',   color: '#26A17B' },
  { name: 'Ethereum',  symbol: 'ETH', logo: '/payment-logos/ETH.svg',    color: '#627EEA' },
  { name: 'CashApp',   symbol: '$',   logo: '/payment-logos/CashApp.svg',color: '#00D632' },
]

function FallbackPaymentIcon({ name, symbol, color }) {
  return (
    <div
      className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3"
      style={{ backgroundColor: color }}
    >
      {symbol}
    </div>
  )
}

export default function HomePage() {
  const { t } = useTranslation()
  const { products } = useProducts({ sortBy: 'created_at', sortDir: 'desc' })
  const featuredProducts = products.slice(0, 3)

  return (
    <div>
      {/* Animated Marquee */}
      <MarqueeBanner />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 py-24 px-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-primary/20 text-primary-300 text-sm font-medium rounded-full mb-6 border border-primary/30">
              🧬 Research-Grade Peptides
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
              {t('home.hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              {t('home.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-600 transition-colors shadow-lg shadow-primary/25"
              >
                {t('home.hero.ctaCatalog')}
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-white/10 text-white border border-white/20 px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-colors"
              >
                <ChatBubbleLeftEllipsisIcon className="h-5 w-5" />
                {t('home.hero.ctaQuote')}
              </Link>
            </div>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-16 grid grid-cols-3 gap-6 max-w-xl mx-auto"
          >
            {[
              { value: '99%+', label: 'Purity' },
              { value: '2-3wk', label: 'Delivery' },
              { value: '500+', label: 'Projects' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-extrabold text-white">{stat.value}</div>
                <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">{t('home.services.title')}</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">{t('home.services.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map(({ icon: Icon, key, color }) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <Card hover className="text-center h-full">
                  <div className={`inline-flex p-3 rounded-xl ${color} mb-4`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {t(`home.services.${key}.title`)}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {t(`home.services.${key}.desc`)}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Peptides</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Our most popular research peptides</p>
              </div>
              <Link to="/catalog" className="text-primary font-medium hover:underline flex items-center gap-1 text-sm">
                View all <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map(product => (
                <Link key={product.id} to={`/peptide/${product.id}`}>
                  <Card hover padding={false} className="overflow-hidden">
                    <div className="aspect-video bg-gradient-to-br from-primary-100 to-accent-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <BeakerIcon className="h-16 w-16 text-primary/30" />
                      )}
                    </div>
                    <div className="p-5">
                      <span className="text-xs text-primary font-medium">{product.categories?.name}</span>
                      <h3 className="font-semibold text-gray-900 dark:text-white mt-1 mb-2">{product.name}</h3>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Purity: <strong className="text-gray-800 dark:text-gray-200">{product.purity_percent}%</strong></span>
                        <span className="font-bold text-primary">${product.price_usd}</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Case Studies */}
      <section className="py-20 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">{t('home.caseStudies.title')}</h2>
            <p className="text-gray-500 dark:text-gray-400">{t('home.caseStudies.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CASE_STUDIES.map((cs, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full">
                  <div className={`h-2 rounded-full bg-gradient-to-r ${cs.color} mb-5`} />
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{cs.category}</span>
                  <h3 className="font-semibold text-gray-900 dark:text-white mt-1 mb-3">{cs.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">{cs.summary}</p>
                  <span className="inline-block text-xs font-medium bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-1 rounded-full">
                    ✓ {cs.result}
                  </span>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">What Researchers Say</h2>
            <p className="text-gray-500 dark:text-gray-400">Trusted by scientists and biotech companies worldwide</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="h-full flex flex-col">
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, s) => (
                      <svg key={s} className="h-4 w-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                  {/* Quote */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-1 mb-5">
                    "{t.quote}"
                  </p>
                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.role} · {t.org}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-20 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">{t('home.payment.title')}</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-10">{t('home.payment.subtitle')}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {PAYMENT_METHODS.map(pm => (
              <Link
                key={pm.symbol}
                to="/payment-instructions"
                className="group"
              >
                <Card hover className="text-center py-6">
                  <div className="mb-3 flex items-center justify-center">
                    <img
                      src={pm.logo}
                      alt={pm.name}
                      className="h-14 w-14 object-contain"
                      onError={e => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                      }}
                    />
                    <div
                      style={{ display: 'none', backgroundColor: pm.color }}
                      className="h-14 w-14 rounded-full items-center justify-center text-white font-bold text-lg"
                    >
                      {pm.symbol}
                    </div>
                  </div>
                  <div className="font-medium text-gray-900 dark:text-white text-sm">{pm.name}</div>
                  <div className="text-xs text-gray-400">{pm.symbol}</div>
                </Card>
              </Link>
            ))}
          </div>
          <Link
            to="/payment-instructions"
            className="inline-flex items-center gap-2 mt-8 text-primary font-medium hover:underline"
          >
            {t('home.payment.viewInstructions')} <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-800 to-accent-700">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Project?</h2>
          <p className="text-primary-100 mb-8">
            Contact our team today. We respond within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              <ChatBubbleLeftEllipsisIcon className="h-5 w-5" />
              Get in Touch
            </Link>
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-colors"
            >
              Browse Catalog
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
