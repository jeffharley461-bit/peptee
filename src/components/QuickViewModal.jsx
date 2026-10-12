import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../store/CartContext'
import { getStockStatus } from '../lib/stockStatus'
import Modal from './ui/Modal'
import toast from 'react-hot-toast'
import {
  BeakerIcon, ShoppingCartIcon, StarIcon, ArrowRightIcon,
} from '@heroicons/react/24/outline'

export default function QuickViewModal({ product, isOpen, onClose }) {
  const { addToCart } = useCart()
  const [qty, setQty] = useState(1)

  if (!product) return null

  const stock = getStockStatus(product.stock_status)
  const out = product.stock_status === 'out_of_stock'

  const handleAdd = () => {
    addToCart(product, qty)
    toast.success(`${product.name} added to cart`)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Quick View" size="lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="aspect-square rounded-xl bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center overflow-hidden">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <BeakerIcon className="h-16 w-16 text-primary/20" />
          )}
        </div>

        <div className="flex flex-col">
          <span className="text-xs text-primary font-medium mb-1">
            {product.categories?.name || 'Research'}
          </span>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h2>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            {product.purity_percent != null && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                <StarIcon className="h-3.5 w-3.5" />
                {product.purity_percent}% purity
              </span>
            )}
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${stock.className}`}>
              {stock.label}
            </span>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4 line-clamp-4">
            {product.description || 'Research-grade product supplied for laboratory and analytical use only.'}
          </p>

          {Array.isArray(product.applications) && product.applications.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {product.applications.slice(0, 4).map(app => (
                <span key={app} className="text-[11px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded">
                  {app}
                </span>
              ))}
            </div>
          )}

          <div className="text-2xl font-extrabold text-primary mb-4">${product.price_usd}</div>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-lg">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="px-3 py-2 text-gray-500 hover:text-primary"
              >
                −
              </button>
              <span className="w-8 text-center text-sm font-medium text-gray-900 dark:text-white">{qty}</span>
              <button
                onClick={() => setQty(q => q + 1)}
                className="px-3 py-2 text-gray-500 hover:text-primary"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAdd}
              disabled={out}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-lg font-semibold hover:bg-primary-600 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <ShoppingCartIcon className="h-5 w-5" />
              Add to Cart
            </button>
          </div>

          <Link
            to={`/peptide/${product.id}`}
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <ArrowRightIcon className="h-4 w-4" />
            View full details
          </Link>
        </div>
      </div>
    </Modal>
  )
}
