import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useProducts } from '../hooks/useProducts'
import { useCategories } from '../hooks/useCategories'
import ProductCard from '../components/ProductCard'
import QuickViewModal from '../components/QuickViewModal'
import Spinner from '../components/ui/Spinner'
import { BeakerIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function CatalogPage() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [search,    setSearch]    = useState(searchParams.get('q') || '')
  const [category,  setCategory]  = useState('')
  const [sortBy,    setSortBy]    = useState('created_at')
  const [sortDir,   setSortDir]   = useState('desc')
  const [quickView, setQuickView] = useState(null)

  const { products, loading } = useProducts({ search, category, sortBy, sortDir })
  const { categories }        = useCategories()

  // Sync category from URL ?category=<name>
  useEffect(() => {
    const name = searchParams.get('category')
    if (name) {
      const match = categories.find(c => c.name.toLowerCase() === name.toLowerCase())
      if (match) {
        setCategory(match.id)
        const next = new URLSearchParams(searchParams)
        next.delete('category')
        setSearchParams(next, { replace: true })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, searchParams])

  const clearFilters = () => {
    setSearch(''); setCategory(''); setSortBy('created_at'); setSortDir('desc');
    setSearchParams({}, { replace: true })
  }

  const hasFilters = search || category || sortBy !== 'created_at'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('catalog.title')}</h1>
        <p className="text-gray-500 dark:text-gray-400">{t('catalog.subtitle')}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => {
              setSearch(e.target.value)
              setSearchParams({ q: e.target.value }, { replace: true })
            }}
            placeholder={t('catalog.search')}
            className="input pl-10"
          />
          {search && (
            <button onClick={() => { setSearch(''); setSearchParams({}, { replace: true }) }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category filter */}
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="input sm:w-48"
        >
          <option value="">{t('catalog.filterCategory')}</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={`${sortBy}-${sortDir}`}
          onChange={e => {
            const [field, dir] = e.target.value.split('-')
            setSortBy(field); setSortDir(dir)
          }}
          className="input sm:w-52"
        >
          <option value="created_at-desc">{t('catalog.sortNewest')}</option>
          <option value="price_usd-asc">{t('catalog.sortPriceAsc')}</option>
          <option value="price_usd-desc">{t('catalog.sortPriceDesc')}</option>
          <option value="purity_percent-desc">{t('catalog.sortPurity')}</option>
        </select>

        {hasFilters && (
          <button onClick={clearFilters} className="text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 flex items-center gap-1 whitespace-nowrap">
            <XMarkIcon className="h-4 w-4" /> {t('catalog.clearFilters')}
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-24">
          <Spinner size="lg" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24">
          <BeakerIcon className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">{t('catalog.noResults')}</p>
          {hasFilters && (
            <button onClick={clearFilters} className="mt-4 text-primary hover:underline text-sm">
              {t('catalog.clearFilters')}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={setQuickView}
            />
          ))}
        </div>
      )}

      {/* Quick View */}
      <QuickViewModal
        product={quickView}
        isOpen={!!quickView}
        onClose={() => setQuickView(null)}
      />
    </div>
  )
}