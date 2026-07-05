import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useProducts } from '../hooks/useProducts'
import { useCategories } from '../hooks/useCategories'
import { useCart } from '../store/CartContext'
import Card from '../components/ui/Card'
import Spinner from '../components/ui/Spinner'
import toast from 'react-hot-toast'
import { BeakerIcon, MagnifyingGlassIcon, XMarkIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'

export default function CatalogPage() {
  const { t } = useTranslation()
  const { addToCart } = useCart()
  const [search,    setSearch]    = useState('')
  const [category,  setCategory]  = useState('')
  const [sortBy,    setSortBy]    = useState('created_at')
  const [sortDir,   setSortDir]   = useState('desc')

  const { products, loading } = useProducts({ search, category, sortBy, sortDir })
  const { categories }        = useCategories()

  const clearFilters = () => {
    setSearch(''); setCategory(''); setSortBy('created_at'); setSortDir('desc')
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
            onChange={e => setSearch(e.target.value)}
            placeholder={t('catalog.search')}
            className="input pl-10"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <Card key={product.id} hover padding={false} className="overflow-hidden flex flex-col">
              {/* Image — clicking navigates to detail */}
              <Link to={`/peptide/${product.id}`} className="block">
                <div className="aspect-video bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center flex-shrink-0">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <BeakerIcon className="h-12 w-12 text-primary/20" />
                  )}
                </div>
              </Link>
              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <span className="text-xs text-primary font-medium mb-1">{product.categories?.name || 'Uncategorized'}</span>
                <Link to={`/peptide/${product.id}`} className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug mb-2 hover:text-primary transition-colors">{product.name}</h3>
                </Link>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <span>{t('catalog.purity')}: </span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{product.purity_percent}%</span>
                  </div>
                  <span className="font-bold text-primary text-sm">${product.price_usd}</span>
                </div>
                <button
                  onClick={() => { addToCart(product); toast.success(`${product.name} added to cart`) }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg text-xs font-semibold transition-all"
                >
                  <ShoppingCartIcon className="h-4 w-4" />
                  Add to Cart
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
