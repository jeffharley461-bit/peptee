import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import Badge from '../components/ui/Badge'
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  ArrowRightIcon,
  ChatBubbleLeftEllipsisIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'

const PAGE_SIZE = 50

export default function PriceListPage() {
  const [items,          setItems]          = useState([])
  const [loading,        setLoading]        = useState(true)
  const [search,         setSearch]         = useState('')
  const [debouncedSearch,setDebouncedSearch] = useState('')
  const [category,       setCategory]       = useState('all')
  const [categories,     setCategories]     = useState([])
  const [page,           setPage]           = useState(0)
  const [total,          setTotal]          = useState(0)

  // Debounce search input 300ms
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(t)
  }, [search])

  // Reset to page 0 when filters change
  useEffect(() => { setPage(0) }, [debouncedSearch, category])

  // Fetch distinct categories for tab labels (once)
  useEffect(() => {
    supabase
      .from('price_list')
      .select('category')
      .not('category', 'is', null)
      .order('category')
      .then(({ data }) => {
        const unique = [...new Set((data || []).map(r => r.category))].filter(Boolean)
        setCategories(unique)
      })
  }, [])

  // Main data fetch — re-runs when search/category/page changes
  useEffect(() => {
    setLoading(true)
    const from = page * PAGE_SIZE
    const to   = from + PAGE_SIZE - 1

    let q = supabase
      .from('price_list')
      .select('*', { count: 'exact' })
      .order('category', { nullsFirst: false })
      .order('name')
      .range(from, to)

    if (category !== 'all') q = q.eq('category', category)
    if (debouncedSearch)    q = q.ilike('name', `%${debouncedSearch}%`)

    q.then(({ data, count }) => {
      setItems(data || [])
      setTotal(count || 0)
      setLoading(false)
    })
  }, [debouncedSearch, category, page])

  const totalPages  = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const showFrom    = total === 0 ? 0 : page * PAGE_SIZE + 1
  const showTo      = Math.min((page + 1) * PAGE_SIZE, total)
  const showCategory = category === 'all'

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
              Current Prices
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
                className="w-full pl-12 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white/15 transition"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category tabs + table */}
      <section className="py-10 px-4 bg-gray-50 dark:bg-gray-900 min-h-[50vh]">
        <div className="max-w-6xl mx-auto">

          {/* Category filter tabs */}
          {categories.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-6 overflow-x-auto pb-1">
              {['all', ...categories].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${
                    category === cat
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary'
                  }`}
                >
                  {cat === 'all' ? 'All Peptides' : cat}
                </button>
              ))}
            </div>
          )}

          {/* Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden overflow-x-auto">
            <table className="w-full text-sm min-w-[520px]">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Peptide</th>
                  {showCategory && (
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  )}
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Unit</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price (USD)</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Availability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {loading ? (
                  [...Array(8)].map((_, i) => (
                    <tr key={i}>
                      <td colSpan={showCategory ? 5 : 4} className="px-4 py-3">
                        <div className="h-5 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={showCategory ? 5 : 4} className="px-4 py-16 text-center text-gray-400">
                      {debouncedSearch
                        ? `No peptides found for "${debouncedSearch}"`
                        : 'No items in this category yet.'}
                    </td>
                  </tr>
                ) : (
                  items.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                        {item.notes && (
                          <p className="text-xs text-gray-400 mt-0.5">{item.notes}</p>
                        )}
                      </td>
                      {showCategory && (
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-sm">
                          {item.category || <span className="text-gray-300">—</span>}
                        </td>
                      )}
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                        {item.unit || '—'}
                      </td>
                      <td className="px-4 py-3 font-bold text-primary">
                        {item.price_usd != null
                          ? `$${parseFloat(item.price_usd).toFixed(2)}`
                          : <span className="text-gray-400 font-normal text-sm">Contact us</span>}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={item.in_stock ? 'success' : 'default'}>
                          {item.in_stock ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && total > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 text-sm text-gray-500 dark:text-gray-400">
              <p>
                Showing <span className="font-medium text-gray-700 dark:text-gray-200">{showFrom}–{showTo}</span> of{' '}
                <span className="font-medium text-gray-700 dark:text-gray-200">{total}</span> peptides
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 0}
                  onClick={() => setPage(p => p - 1)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                  Prev
                </button>
                <span className="px-3 py-1.5 text-gray-600 dark:text-gray-300">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(p => p + 1)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>
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
