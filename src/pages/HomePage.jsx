import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import MarqueeBanner from '../components/MarqueeBanner'
import TrustBadges from '../components/TrustBadges'
import CategoryGrid from '../components/CategoryGrid'
import ProductCard from '../components/ProductCard'
import QuickViewModal from '../components/QuickViewModal'
import HowItWorksSection from '../components/HowItWorksSection'
import ResearchHubBanner from '../components/ResearchHubBanner'
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

const PAYMENT_METHODS = [
  { name: 'Bitcoin',   symbol: 'BTC', logo: '/payment-logos/BTC.svg',    color: '#F7931A' },
  { name: 'Tether',    symbol: 'USDT',logo: '/payment-logos/USDT.svg',   color: '#26A17B' },
  { name: 'Ethereum',  symbol: 'ETH', logo: '/payment-logos/ETH.svg',    color: '#627EEA' },
  { name: 'CashApp',   symbol: '$',   logo: '/payment-logos/CashApp.svg',color: '#00D632' },
]

export default function HomePage() {
  const { t } = useTranslation()
  const { products } = useProducts({ sortBy: 'created_at', sortDir: 'desc' })
  const featuredProducts = products.slice(0, 4)
  const [quickView, setQuickView] = useState(null)

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

      {/* Trust Badges */}
      <TrustBadges />

      {/* Category Grid */}
      <CategoryGrid />

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setQuickView}
                />
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

      {/* How It Works */}
      <HowItWorksSection />

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

      {/* Research Hub */}
      <ResearchHubBanner />

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

      {/* Quick View */}
      <QuickViewModal
        product={quickView}
        isOpen={!!quickView}
        onClose={() => setQuickView(null)}
      />
    </div>
  )
}