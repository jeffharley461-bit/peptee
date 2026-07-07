import { useCart } from '../store/CartContext'
import { XMarkIcon, TrashIcon, MinusIcon, PlusIcon, ShoppingCartIcon, BeakerIcon } from '@heroicons/react/24/outline'

export default function CartDrawer({ isOpen, onClose, onCheckout }) {
  const { items, removeFromCart, updateQty, total, count } = useCart()
  const shipping = total >= 500 ? 0 : 30
  const grandTotal = total + shipping

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:max-w-md bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <ShoppingCartIcon className="h-5 w-5 text-primary" />
            <h2 className="font-bold text-gray-900 dark:text-white text-lg">
              Your Cart
            </h2>
            {count > 0 && (
              <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded-full">
                {count} item{count !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center pb-16">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <BeakerIcon className="h-9 w-9 text-gray-300 dark:text-gray-600" />
              </div>
              <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Your cart is empty</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Browse the catalog and add products</p>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map(({ product, qty }) => (
                <div key={product.id} className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-3.5">
                  <div className="flex gap-3">
                    {/* Product image */}
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {product.image_url
                        ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                        : <BeakerIcon className="h-7 w-7 text-primary/30" />
                      }
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white leading-snug line-clamp-2">
                        {product.name}
                      </p>
                      {(product.unit || product.purity_percent) && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {[product.unit, product.purity_percent && `${product.purity_percent}% purity`]
                            .filter(Boolean).join(' · ')}
                        </p>
                      )}
                      {product.price_usd && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          ${parseFloat(product.price_usd).toFixed(2)} each
                        </p>
                      )}
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="p-1.5 text-gray-300 hover:text-red-400 transition-colors self-start -mt-0.5 -mr-0.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Qty controls + line total */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQty(product.id, qty - 1)}
                        className="w-8 h-8 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors active:scale-95"
                      >
                        <MinusIcon className="h-3.5 w-3.5" />
                      </button>
                      <span className="text-sm font-bold text-gray-800 dark:text-gray-100 w-8 text-center tabular-nums">
                        {qty}
                      </span>
                      <button
                        onClick={() => updateQty(product.id, qty + 1)}
                        className="w-8 h-8 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors active:scale-95"
                      >
                        <PlusIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="text-base font-bold text-primary tabular-nums">
                      {product.price_usd
                        ? `$${(parseFloat(product.price_usd) * qty).toFixed(2)}`
                        : <span className="text-xs font-normal text-gray-400">Quote</span>
                      }
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer — only when cart has items */}
        {items.length > 0 && (
          <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-5 py-5 space-y-3.5">
            {/* Shipping + subtotal */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Subtotal</span>
                <span className="font-medium text-gray-700 dark:text-gray-200 tabular-nums">${total.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-500 font-semibold' : 'font-medium text-gray-700 dark:text-gray-200'}>
                  {shipping === 0 ? 'FREE' : '$30.00'}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
              <span className="font-bold text-gray-900 dark:text-white">Total</span>
              <div className="text-right">
                <p className="text-2xl font-extrabold text-gray-900 dark:text-white tabular-nums">
                  ${grandTotal.toFixed(2)}
                </p>
                <p className="text-xs text-gray-400">USD</p>
              </div>
            </div>

            {/* Free shipping progress */}
            {shipping > 0 && (
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                  <span>Add ${(500 - total).toFixed(2)} more for free shipping</span>
                  <span>{Math.min(100, Math.round((total / 500) * 100))}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (total / 500) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Checkout CTA */}
            <button
              onClick={onCheckout}
              className="w-full btn-primary py-4 text-base font-bold rounded-xl"
            >
              Proceed to Checkout →
            </button>
          </div>
        )}
      </div>
    </>
  )
}
