import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCart } from '../store/CartContext'
import { getStockStatus } from '../lib/stockStatus'
import toast from 'react-hot-toast'
import {
  BeakerIcon, ShoppingCartIcon, EyeIcon, StarIcon,
} from '@heroicons/react/24/outline'

export default function ProductCard({ product, onQuickView }) {
  const { t } = useTranslation()
  const { addToCart } = useCart()
  const stock = getStockStatus(product.stock_status)
  const description = product.description || ''

  const handleAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (product.stock_status === 'out_of_stock') {
      toast.error(`${product.name} is currently out of stock`)
      return
    }
    addToCart(product)
    toast.success(`${product.name} added to cart`)
  }

  const handleQuickView = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onQuickView?.(product)
  }

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col">
      {/* Image */}
      <Link to={`/peptide/${product.id}`} className="block relative">
        <div className="aspect-video bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center flex-shrink-0">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <BeakerIcon className="h-12 w-12 text-primary/20" />
          )}
        </div>
        {/* Purity badge */}
        {product.purity_percent != null && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur text-[11px] font-semibold text-primary px-2 py-1 rounded-full shadow-sm">
            <StarIcon className="h-3 w-3" />
            {product.purity_percent}% purity
          </span>
        )}
        {/* Quick view overlay */}
        {onQuickView && (
          <button
            onClick={handleQuickView}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur text-gray-600 dark:text-gray-300 hover:text-primary shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Quick view"
          >
            <EyeIcon className="h-4 w-4" />
          </button>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-primary font-medium">{product.categories?.name || 'Research'}</span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${stock.className}`}>
            {stock.label}
          </span>
        </div>

        <Link to={`/peptide/${product.id}`} className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug mb-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3 line-clamp-2">
            {description}
          </p>
        )}

        <div className="flex items-center justify-between mb-3 mt-auto">
          <span className="text-xs text-gray-400">
            {t('catalog.purity')}: <span className="font-medium text-gray-600 dark:text-gray-300">
              {product.purity_percent !== null && product.purity_percent !== undefined
                ? `${Number(product.purity_percent)}%`
                : '—'}
            </span>
          </span>
          <span className="font-bold text-primary text-base">${product.price_usd}</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            disabled={product.stock_status === 'out_of_stock'}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-primary text-white hover:bg-primary-600 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed rounded-lg text-xs font-semibold transition-colors"
          >
            <ShoppingCartIcon className="h-4 w-4" />
            {product.stock_status === 'out_of_stock' ? 'Out of Stock' : t('catalog.addToCart') || 'Add to Cart'}
          </button>
          {onQuickView && (
            <button
              onClick={handleQuickView}
              className="px-3 py-2 border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:text-primary hover:border-primary rounded-lg text-xs font-semibold transition-colors"
            >
              {t('catalog.quickView') || 'Quick View'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
