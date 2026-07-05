import { useCart } from '../store/CartContext'
import { XMarkIcon, TrashIcon, MinusIcon, PlusIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import { BeakerIcon } from '@heroicons/react/24/outline'

export default function CartDrawer({ isOpen, onClose, onCheckout }) {
  const { items, removeFromCart, updateQty, total, count } = useCart()

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-sm bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <ShoppingCartIcon className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-gray-900 dark:text-white">
              Cart {count > 0 && <span className="text-primary">({count})</span>}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <BeakerIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">Your cart is empty</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Browse the catalog and add peptides</p>
            </div>
          ) : (
            items.map(({ product, qty }) => (
              <div key={product.id} className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {product.image_url
                    ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    : <BeakerIcon className="h-6 w-6 text-primary/30" />
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight line-clamp-2">{product.name}</p>
                  {product.purity_percent && (
                    <p className="text-xs text-gray-400 mt-0.5">Purity {product.purity_percent}%</p>
                  )}
                  <p className="text-sm font-bold text-primary mt-1">${(parseFloat(product.price_usd || 0) * qty).toFixed(2)}</p>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQty(product.id, qty - 1)}
                      className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary transition-colors"
                    >
                      <MinusIcon className="h-3 w-3" />
                    </button>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-5 text-center">{qty}</span>
                    <button
                      onClick={() => updateQty(product.id, qty + 1)}
                      className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary transition-colors"
                    >
                      <PlusIcon className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(product.id)}
                  className="p-1.5 text-gray-300 hover:text-red-500 transition-colors self-start"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700 space-y-3 bg-white dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">{count} item{count !== 1 ? 's' : ''}</span>
              <div className="text-right">
                <p className="text-xs text-gray-400">Estimated total</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">${total.toFixed(2)} <span className="text-xs font-normal text-gray-400">USD</span></p>
              </div>
            </div>
            <button
              onClick={onCheckout}
              className="w-full btn-primary py-3 text-sm font-semibold rounded-xl"
            >
              Proceed to Payment →
            </button>
          </div>
        )}
      </div>
    </>
  )
}
