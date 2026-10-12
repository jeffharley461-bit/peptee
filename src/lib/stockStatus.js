export const STOCK_STATUSES = {
  in_stock:     { label: 'In Stock',     className: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' },
  low_stock:    { label: 'Low Stock',    className: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' },
  out_of_stock: { label: 'Out of Stock', className: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' },
  pre_order:    { label: 'Pre-Order',    className: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
}

export function getStockStatus(status) {
  return STOCK_STATUSES[status] || STOCK_STATUSES.in_stock
}
