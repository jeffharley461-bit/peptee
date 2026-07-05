export default function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' }
  return (
    <div className={`animate-spin rounded-full border-2 border-gray-200 dark:border-gray-700 border-t-primary ${sizes[size]} ${className}`} />
  )
}

export function FullPageSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
      <Spinner size="lg" />
    </div>
  )
}
