import { motion } from 'framer-motion'
import {
  ShieldCheckIcon, SparklesIcon, TruckIcon, ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline'

const BADGES = [
  { icon: ShieldCheckIcon,            title: 'Third-Party Tested',    desc: 'Independent lab verification on every batch' },
  { icon: SparklesIcon,               title: 'High-Purity Peptides',  desc: '99%+ purity confirmed by HPLC analysis' },
  { icon: TruckIcon,                  title: 'Tracked Fast Shipping', desc: 'Discreet, tracked delivery worldwide' },
  { icon: ClipboardDocumentCheckIcon, title: 'Batch Verified Quality', desc: 'COA available for every product batch' },
]

export default function TrustBadges() {
  return (
    <section className="bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {BADGES.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-3"
            >
              <div className="flex-shrink-0 p-2.5 rounded-xl bg-primary/10 text-primary">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">{title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
