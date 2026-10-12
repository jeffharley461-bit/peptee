import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BeakerIcon, Squares2X2Icon, WrenchScrewdriverIcon, ArrowRightIcon,
} from '@heroicons/react/24/outline'

const CATEGORIES = [
  {
    name: 'Peptides',
    query: 'Peptides',
    desc: 'Research-grade peptides, 99%+ purity with COA',
    icon: BeakerIcon,
    color: 'from-primary-500 to-cyan-400',
  },
  {
    name: 'Research Bundles',
    query: 'Research Bundles',
    desc: 'Curated multi-peptide kits for lab efficiency',
    icon: Squares2X2Icon,
    color: 'from-accent-500 to-purple-400',
  },
  {
    name: 'Laboratory Accessories',
    query: 'Laboratory Accessories',
    desc: 'Reconstitution, storage & handling essentials',
    icon: WrenchScrewdriverIcon,
    color: 'from-emerald-500 to-teal-400',
  },
]

export default function CategoryGrid() {
  return (
    <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Browse by Category</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Everything you need for laboratory research, organised for fast discovery
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CATEGORIES.map(({ name, query, desc, icon: Icon, color }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/catalog?category=${encodeURIComponent(query)}`}
                className="group block h-full rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className={`h-28 bg-gradient-to-br ${color} flex items-center justify-center`}>
                  <Icon className="h-12 w-12 text-white/90" />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center justify-between">
                    {name}
                    <ArrowRightIcon className="h-4 w-4 text-primary opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
