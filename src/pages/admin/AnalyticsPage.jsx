import { useTranslation } from 'react-i18next'
import { useAnalytics } from '../../hooks/useAnalytics'
import Spinner from '../../components/ui/Spinner'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const COLORS = ['#0ea5e9', '#6366f1', '#10b981', '#f59e0b', '#ef4444']

function ChartCard({ title, children, subtitle }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
      {subtitle && <p className="text-xs text-gray-400 mb-4">{subtitle}</p>}
      {!subtitle && <div className="mb-4" />}
      {children}
    </div>
  )
}

export default function AnalyticsPage() {
  const { t } = useTranslation()
  const { data, loading } = useAnalytics()

  if (loading) return <div className="flex justify-center py-32"><Spinner size="lg" /></div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">{t('admin.analytics.title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inquiries over time */}
        <ChartCard title={t('admin.analytics.inquiriesOverTime')} subtitle={t('admin.analytics.last30Days')}>
          {data.inquiriesByMonth.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.inquiriesByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#0ea5e9" radius={[4,4,0,0]} name="Inquiries" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">{t('admin.analytics.noData')}</div>
          )}
        </ChartCard>

        {/* Inquiries by status */}
        <ChartCard title={t('admin.analytics.byStatus')}>
          {data.inquiriesByStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={data.inquiriesByStatus}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ status, percent }) => `${status} (${(percent * 100).toFixed(0)}%)`}
                >
                  {data.inquiriesByStatus.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">{t('admin.analytics.noData')}</div>
          )}
        </ChartCard>

        {/* Top products */}
        <ChartCard title={t('admin.analytics.topProducts')}>
          {data.topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart layout="vertical" data={data.topProducts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[0,4,4,0]} name="Inquiries" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">{t('admin.analytics.noData')}</div>
          )}
        </ChartCard>

        {/* Revenue estimate (inquiries * avg price assumption) */}
        <ChartCard title={t('admin.analytics.revenueEstimate')} subtitle="Based on inquiry volume × $500 avg order">
          {data.inquiriesByMonth.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data.inquiriesByMonth.map(d => ({ ...d, revenue: d.count * 500 }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${v}`} />
                <Tooltip formatter={v => `$${v.toLocaleString()}`} />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} name="Est. Revenue" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">{t('admin.analytics.noData')}</div>
          )}
        </ChartCard>
      </div>
    </div>
  )
}
