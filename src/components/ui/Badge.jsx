export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default:   'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
    primary:   'bg-primary/10 text-primary',
    accent:    'bg-accent/10 text-accent',
    success:   'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    warning:   'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    danger:    'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    pending:   'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    responded: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    completed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    archived:  'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400',
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  )
}
