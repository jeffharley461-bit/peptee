import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Card from '../components/ui/Card'
import {
  BeakerIcon, ShieldCheckIcon, SparklesIcon, TruckIcon,
  CheckCircleIcon, ArrowRightIcon, ChatBubbleLeftEllipsisIcon,
} from '@heroicons/react/24/outline'

const STATS = [
  { value: '500+', label: 'Projects Completed' },
  { value: '99%+', label: 'Purity Guaranteed' },
  { value: '50+',  label: 'Countries Served' },
  { value: '2–3wk', label: 'Average Delivery' },
]

const EXPERTISE = [
  {
    icon: BeakerIcon,
    title: 'Custom Peptide Synthesis',
    desc: 'State-of-the-art SPPS (Solid-Phase Peptide Synthesis) technology for any sequence, any modification, any scale.',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Rigorous Quality Control',
    desc: 'Every batch is verified by HPLC and mass spectrometry. We do not ship until purity exceeds 99%.',
    color: 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
  },
  {
    icon: SparklesIcon,
    title: 'R&D Consulting',
    desc: 'PhD-level scientists available to assist with peptide design, optimization, and application guidance.',
    color: 'bg-accent/10 text-accent',
  },
  {
    icon: TruckIcon,
    title: 'Cold-Chain Delivery',
    desc: 'Expedited worldwide shipping with dry ice or ice packs to preserve peptide integrity from lab to door.',
    color: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
  },
]

const TRUST = [
  'HPLC & mass spectrometry verification on every batch',
  'Certificate of Analysis (CoA) provided with every order',
  'Cold-chain logistics to 50+ countries',
  'Discreet, professionally labelled packaging',
  '24/7 support via WhatsApp and email',
  '500+ successful projects for researchers worldwide',
]

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-primary/20 text-primary-300 text-sm font-medium rounded-full mb-6 border border-primary/30">
              🧬 About PeptideForge
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
              Research-Grade Peptides,<br />Built on Trust
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              PeptideForge was founded by scientists for scientists. We combine cutting-edge synthesis technology
              with rigorous quality control to deliver custom peptides that meet the demands of serious research.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary py-10 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
          {STATS.map(stat => (
            <div key={stat.label}>
              <div className="text-3xl font-extrabold">{stat.value}</div>
              <div className="text-sm text-primary-100 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-5">Our Mission</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
            We believe that access to high-quality research peptides should be simple, transparent, and reliable.
            From a single custom sequence to multi-gram bulk orders, we deliver with the same commitment to purity,
            speed, and scientific integrity.
          </p>
        </div>
      </section>

      {/* Expertise */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">What We Do</h2>
            <p className="text-gray-500 dark:text-gray-400">End-to-end peptide solutions for researchers and biotech companies</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {EXPERTISE.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="flex items-start gap-4 h-full">
                  <div className={`p-3 rounded-xl flex-shrink-0 ${color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-20 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Why Researchers Trust Us</h2>
            <p className="text-gray-500 dark:text-gray-400">Our standards are non-negotiable — your research depends on it</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TRUST.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
              >
                <CheckCircleIcon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700 dark:text-gray-300">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-800 to-accent-700">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Research?</h2>
          <p className="text-primary-100 mb-8">Browse our peptide catalog or get in touch with our team.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Browse Catalog
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-colors"
            >
              <ChatBubbleLeftEllipsisIcon className="h-5 w-5" />
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
