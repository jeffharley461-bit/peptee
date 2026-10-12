export default function LegalPage({ title, subtitle, updated, children }) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">{title}</h1>
      {subtitle && <p className="text-gray-500 dark:text-gray-400 mb-2">{subtitle}</p>}
      {updated && <p className="text-xs text-gray-400 mb-8">Last updated: {updated}</p>}
      <div className="legal">
        {children}
      </div>
    </div>
  )
}
