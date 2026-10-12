import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { StarIcon, ChatBubbleLeftEllipsisIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

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

export default function ReviewsPage() {
  const { t } = useTranslation()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
          {t('reviews.badge')}
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          {t('reviews.title')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          {t('reviews.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TESTIMONIALS.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 flex flex-col"
          >
            <div className="flex gap-0.5 mb-4">
              {[...Array(5)].map((_, s) => (
                <StarIcon key={s} className="h-4 w-4 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-1 mb-5">
              "{item.quote}"
            </p>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                {item.initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.name}</p>
                <p className="text-xs text-gray-400">{item.role} · {item.org}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-14 text-center bg-gray-50 dark:bg-gray-900 rounded-2xl p-10">
        <ChatBubbleLeftEllipsisIcon className="h-10 w-10 text-primary mx-auto mb-3" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('reviews.ctaTitle')}</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">{t('reviews.ctaSubtitle')}</p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors"
        >
          {t('reviews.ctaButton')}
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
