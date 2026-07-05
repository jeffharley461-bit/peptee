export default function Card({ children, className = '', hover = false, padding = true }) {
  return (
    <div className={`
      bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm
      ${hover ? 'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer' : ''}
      ${padding ? 'p-6' : ''}
      ${className}
    `}>
      {children}
    </div>
  )
}
