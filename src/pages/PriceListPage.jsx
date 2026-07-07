import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import Badge from '../components/ui/Badge'
import {
  MagnifyingGlassIcon,
  ArrowRightIcon,
  ChatBubbleLeftEllipsisIcon,
} from '@heroicons/react/24/outline'

export default function PriceListPage() {
  const [items,   setItems]   = useState([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')

  useEffect(() => {
    supabase
      .from('price_list')
      .select('*')
      .order('category', { nullsFirst: false })
      .order('display_order')
      .order('name')
      .then(({ data }) => { setItems(data || []); setLoading(false) })
  }, [])

  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    (item.category || '').toLowerCase().includes(search.toLowerCase())
  )

  const groups = filtered.reduce((acc, item) => {
    const key = item.category || 'Other'
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})

  const sortedGroups = Object.entries(groups).sort(([a], [b]) => {
    if (a === 'Other') return 1
    if (b === 'Other') return -1
    return a.localeCompare(b)
  })

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-primary/20 text-primary-300 text-sm font-medium rounded-full mb-6 border border-primary/30">
              💊 Current Prices
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
              Peptide Price List
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
              All prices are in USD. Contact us for bulk orders, custom sequences, and special modifications.
            </p>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search peptides..."
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white/15 transition"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Price tables */}
      <section className="py-14 px-4 bg-gray-50 dark:bg-gray-900 min-h-[40vh]">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-40 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : sortedGroups.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              <p className="text-lg">
                {search ? `No peptides found for "${search}"` : 'Price list coming soon.'}
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {sortedGroups.map(([category, categoryItems], gi) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: gi * 0.05 }}
                >
                  <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                    {category}
                    <span className="text-sm font-normal text-gray-400">
                      ({categoryItems.length})
                    </span>
                  </h2>

                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden overflow-x-auto">
                    <table className="w-full text-sm min-w-[480px]">
                      <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Peptide</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Unit</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price (USD)</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Availability</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {categoryItems.map(item => (
                          <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <td className="px-4 py-3">
                              <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                              {item.notes && (
                                <p className="text-xs text-gray-400 mt-0.5">{item.notes}</p>
                              )}
                            </td>
                            <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                              {item.unit || '—'}
                            </td>
                            <td className="px-4 py-3 font-bold text-primary">
                              ${parseFloat(item.price_usd).toFixed(2)}
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant={item.in_stock ? 'success' : 'default'}>
                                {item.in_stock ? 'In Stock' : 'Out of Stock'}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-800 to-accent-700">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need a Custom Quote?</h2>
          <p className="text-primary-100 mb-8">
            Bulk orders, custom sequences, and special modifications — get in touch for personalised pricing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              <ChatBubbleLeftEllipsisIcon className="h-5 w-5" />
              Contact Us
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
