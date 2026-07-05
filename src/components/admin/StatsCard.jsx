export default function StatsCard({ title, value, subtitle, icon: Icon, color = 'primary', trend }) {
  const colors = {
    primary:  'bg-primary/10 text-primary',
    accent:   'bg-accent/10 text-accent',
    success:  'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    warning:  'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${colors[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
      {trend !== undefined && (
        <div className={`mt-4 text-xs font-medium ${trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last month
        </div>
      )}
    </div>
  )
}
