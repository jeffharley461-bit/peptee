export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  ...props
}) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed'

  const variants = {
    primary:   'bg-primary text-white hover:bg-primary-600 focus:ring-primary',
    secondary: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
    accent:    'bg-accent text-white hover:bg-accent-600 focus:ring-accent',
    danger:    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost:     'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-300',
    outline:   'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3 text-base gap-2',
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <span className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  )
}
