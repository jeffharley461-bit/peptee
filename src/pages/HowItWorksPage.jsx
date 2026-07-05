import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Card from '../components/ui/Card'
import { ShieldCheckIcon, BoltIcon, AcademicCapIcon, PuzzlePieceIcon } from '@heroicons/react/24/outline'

const STEPS_ICONS = ['📋', '💬', '🔬', '✅', '🚚']
const FEATURE_ICONS = [ShieldCheckIcon, BoltIcon, AcademicCapIcon, PuzzlePieceIcon]
const FEATURE_KEYS = ['purity', 'speed', 'support', 'custom']
const FEATURE_COLORS = [
  'bg-primary/10 text-primary',
  'bg-accent/10 text-accent',
  'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
  'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
]

export default function HowItWorksPage() {
  const { t } = useTranslation()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">{t('howItWorks.title')}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">{t('howItWorks.subtitle')}</p>
      </div>

      {/* Steps timeline */}
      <div className="relative mb-20">
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary to-accent -translate-x-1/2" />
        <div className="space-y-10">
          {[1,2,3,4,5].map((step, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`flex items-center gap-6 md:gap-12 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className={`flex-1 ${i % 2 !== 0 ? 'md:text-right' : ''}`}>
                <Card>
                  <div className="text-3xl mb-3">{STEPS_ICONS[i]}</div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                    {t(`howItWorks.steps.${step}.title`)}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {t(`howItWorks.steps.${step}.desc`)}
                  </p>
                </Card>
              </div>

              {/* Step circle */}
              <div className="relative z-10 flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold shadow-lg">
                  {step}
                </div>
              </div>

              <div className="flex-1 hidden md:block" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{t('howItWorks.features.title')}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        {FEATURE_KEYS.map((key, i) => {
          const Icon = FEATURE_ICONS[i]
          return (
            <Card key={key} className="flex items-start gap-4">
              <div className={`p-3 rounded-xl flex-shrink-0 ${FEATURE_COLORS[i]}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {t(`howItWorks.features.${key}.title`)}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {t(`howItWorks.features.${key}.desc`)}
                </p>
              </div>
            </Card>
          )
        })}
      </div>

      {/* CTA */}
      <div className="text-center bg-gradient-to-r from-primary to-accent rounded-2xl p-10 text-white">
        <h3 className="text-2xl font-bold mb-3">Ready to get started?</h3>
        <p className="text-primary-100 mb-6">Submit your inquiry and receive a quote within 24 hours.</p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
        >
          Browse Catalog
        </Link>
      </div>
    </div>
  )
}
