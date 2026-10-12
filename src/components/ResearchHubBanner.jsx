import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  AcademicCapIcon, ArchiveBoxIcon, SparklesIcon, ShieldCheckIcon, ArrowRightIcon,
} from '@heroicons/react/24/outline'

const TOPICS = [
  {
    icon: ArchiveBoxIcon,
    title: 'Proper Storage',
    desc: 'Lyophilised peptides should be stored at -20°C, protected from light and moisture, for optimal stability.',
  },
  {
    icon: SparklesIcon,
    title: 'Purity Standards',
    desc: 'All products are independently verified by HPLC and mass spectrometry to confirm 99%+ purity.',
  },
  {
    icon: AcademicCapIcon,
    title: 'Handling & Research Use',
    desc: 'Reconstitution and handling guidance is provided for laboratory and analytical research applications only.',
  },
]

export default function ResearchHubBanner() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
          <div className="lg:col-span-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/20 text-primary-200 text-xs font-semibold rounded-full mb-5 border border-primary/30">
              <AcademicCapIcon className="h-4 w-4" />
              Research Hub
            </span>
            <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
              Educational Resources for Laboratory Research
            </h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              Understand peptide storage, purity standards, and handling best practices before
              your research begins. All information is provided for laboratory and analytical
              purposes only.
            </p>
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Explore the Research Hub
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {TOPICS.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
              >
                <div className="inline-flex p-2.5 rounded-xl bg-primary/20 text-primary-200 mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex items-center gap-2 text-xs text-gray-400 border-t border-white/10 pt-6">
          <ShieldCheckIcon className="h-4 w-4 text-primary-300 flex-shrink-0" />
          All products are supplied strictly for laboratory, analytical, and research purposes and are not for human or veterinary use.
        </div>
      </div>
    </section>
  )
}
