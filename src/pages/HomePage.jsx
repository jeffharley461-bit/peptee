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
  ArrowRightIcon, ChatBubbleLeftEllipsisIcon, DocumentTextIcon,
  ChevronDownIcon, Squares2X2Icon,
} from '@heroicons/react/24/outline'

const HERO_STATS = [
  { value: '99%+', label: 'Verified Purity' },
  { value: 'COA', label: 'Every Batch' },
  { value: '48h', label: 'Dispatch' },
]

const SERVICES = [
  { icon: BeakerIcon,      key: 'synthesis',   color: 'text-primary bg-primary/10' },
  { icon: SparklesIcon,    key: 'consulting',  color: 'text-accent bg-accent/10' },
  { icon: ShieldCheckIcon, key: 'testing',     color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' },
  { icon: TruckIcon,       key: 'delivery',    color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20' },
]

const FAQS = [
  {
    q: 'Are your peptides third-party tested?',
    a: 'Yes. Every batch is analysed by an independent laboratory using HPLC and mass spectrometry. The resulting Certificate of Analysis (COA) is published on our Test Reports page and linked from each product.',
  },
  {
    q: 'How should I store my peptides?',
    a: 'Lyophilised peptides should be kept refrigerated, dry and protected from light. Once reconstituted, store at 2–8°C and use within the period indicated on the datasheet.',
  },
  {
    q: 'What purity can I expect?',
    a: 'Our research peptides are supplied at 98% or higher purity, with most batches testing above 99% by HPLC. The exact figure for your batch is shown on its COA.',
  },
  {
    q: 'How are orders shipped?',
    a: 'Orders are dispatched within 48 hours in discreet, tracked packaging. Tracking details are emailed as soon as your parcel leaves our facility.',
  },
  {
    q: 'Are these products for human use?',
    a: 'No. All products are supplied strictly for laboratory research purposes only and are not intended for human or veterinary consumption.',
  },
]

function FaqItem({ faq, isOpen, onToggle }) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-medium text-gray-900 dark:text-white text-sm">{faq.q}</span>
        <ChevronDownIcon className={`h-5 w-5 text-primary flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-5 pb-5 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          {faq.a}
        </div>
      )}
    </div>
  )
}

export default function HomePage() {
  const { t } = useTranslation()
  const { products } = useProducts({ sortBy: 'created_at', sortDir: 'desc' })
  const { products: bundles } = useProducts({ category: 'Research Bundles' })
  const featuredProducts = products.slice(0, 4)
  const bundleProducts = bundles.slice(0, 3)
  const [quickView, setQuickView] = useState(null)
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <div>
      {/* Animated Marquee */}
      <MarqueeBanner />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-white dark:from-gray-900 dark:via-gray-950 dark:to-gray-950 py-20 px-4">
        <div className="absolute -top-32 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-40 -left-24 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-6 border border-primary/20">
              <ShieldCheckIcon className="h-4 w-4" />
              Third-Party Tested Peptides
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
              {t('home.hero.title')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-9 max-w-xl leading-relaxed">
              {t('home.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/catalog"
                className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-600 transition-colors shadow-lg shadow-primary/25"
              >
                {t('home.hero.ctaCatalog')}
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
              <Link
                to="/test-reports"
                className="inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-primary hover:text-primary transition-colors"
              >
                <DocumentTextIcon className="h-5 w-5" />
                View Test Reports
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
              {HERO_STATS.map(stat => (
                <div key={stat.label}>
                  <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{stat.value}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative"
          >
            <div className="relative mx-auto max-w-md rounded-3xl bg-gradient-to-br from-primary to-emerald-700 p-1 shadow-2xl shadow-primary/20">
              <div className="rounded-[22px] bg-white dark:bg-gray-900 p-6">
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-emerald-50 to-accent-50 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center mb-5">
                  <BeakerIcon className="h-28 w-28 text-primary/30" />
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">Certificate of Analysis</span>
                  <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">HPLC / MS</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Independently verified purity for every batch</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-gray-50 dark:bg-gray-800 px-4 py-3">
                    <div className="text-[10px] uppercase tracking-wider text-gray-400">Purity</div>
                    <div className="text-lg font-bold text-primary">99%+</div>
                  </div>
                  <div className="rounded-xl bg-gray-50 dark:bg-gray-800 px-4 py-3">
                    <div className="text-[10px] uppercase tracking-wider text-gray-400">Status</div>
                    <div className="text-lg font-bold text-emerald-600">Verified</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <TrustBadges />

      {/* Category Grid */}
      <CategoryGrid />

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-20 px-4 bg-white dark:bg-gray-950">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">Best Sellers</span>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">Featured Peptides</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Our most popular research peptides</p>
              </div>
              <Link to="/catalog" className="hidden sm:flex text-primary font-medium hover:underline items-center gap-1 text-sm">
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

      {/* Research Bundles */}
      {bundleProducts.length > 0 && (
        <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-accent">Save More</span>
                <h2 className="flex items-center gap-2 text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  <Squares2X2Icon className="h-7 w-7 text-accent" />
                  Research Bundles
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Curated multi-peptide kits for laboratory efficiency</p>
              </div>
              <Link to="/catalog?category=Research%20Bundles" className="hidden sm:flex text-primary font-medium hover:underline items-center gap-1 text-sm">
                View all <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {bundleProducts.map(product => (
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

      {/* How It Works */}
      <HowItWorksSection />

      {/* COA Band */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-800 to-emerald-700">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[1.5fr_1fr] gap-8 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 text-white text-xs font-medium rounded-full mb-4">
              <DocumentTextIcon className="h-4 w-4" />
              Transparency
            </span>
            <h2 className="text-3xl font-bold text-white mb-3">Every Batch Ships With a Certificate of Analysis</h2>
            <p className="text-white/80 leading-relaxed">
              We publish the third-party HPLC and mass-spectrometry results for each production batch, so you can verify identity and purity before you buy.
            </p>
          </div>
          <div className="flex md:justify-end">
            <Link
              to="/test-reports"
              className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Browse Test Reports
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Support</span>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-2 mb-3">Frequently Asked Questions</h2>
            <p className="text-gray-500 dark:text-gray-400">Everything you need to know about ordering research peptides</p>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <FaqItem
                key={faq.q}
                faq={faq}
                isOpen={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Research Hub */}
      <ResearchHubBanner />

      {/* CTA Banner */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Ready to Order Research Peptides?</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Browse the catalog or contact our team. We respond within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/catalog"
              className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-600 transition-colors"
            >
              Browse Catalog
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white px-8 py-4 rounded-xl font-semibold hover:border-primary hover:text-primary transition-colors"
            >
              <ChatBubbleLeftEllipsisIcon className="h-5 w-5" />
              Get in Touch
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
