import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAnalytics } from '../../hooks/useAnalytics'
import StatsCard from '../../components/admin/StatsCard'
import Badge from '../../components/ui/Badge'
import Spinner from '../../components/ui/Spinner'
import { CubeIcon, InboxIcon, StarIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function DashboardPage() {
  const { t } = useTranslation()
  const { data, loading } = useAnalytics()

  if (loading) return <div className="flex justify-center py-32"><Spinner size="lg" /></div>

  const stats = [
    { key: 'totalProducts',  value: data.totalProducts,  icon: CubeIcon,     color: 'primary' },
    { key: 'totalInquiries', value: data.totalInquiries, icon: InboxIcon,    color: 'accent' },
    { key: 'newInquiries',   value: data.newInquiries,   icon: StarIcon,     color: 'warning' },
    { key: 'responseRate',   value: `${data.responseRate}%`, icon: ChartBarIcon, color: 'success' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('admin.dashboard.title')}</h1>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map(({ key, value, icon, color }) => (
          <StatsCard
            key={key}
            title={t(`admin.dashboard.${key}`)}
            value={value}
            icon={icon}
            color={color}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inquiries chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-5">{t('admin.analytics.inquiriesOverTime')}</h3>
          {data.inquiriesByMonth.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.inquiriesByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Inquiries" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">{t('admin.analytics.noData')}</div>
          )}
        </div>

        {/* Recent inquiries */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-gray-900 dark:text-white">{t('admin.dashboard.recentInquiries')}</h3>
            <Link to="/admin/inquiries" className="text-sm text-primary hover:underline">{t('admin.dashboard.viewAll')}</Link>
          </div>
          {data.recentInquiries.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">{t('common.noData')}</p>
          ) : (
            <div className="space-y-3">
              {data.recentInquiries.map(inq => (
                <div key={inq.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{inq.customer_name}</p>
                    <p className="text-xs text-gray-400 truncate">{inq.email}</p>
                  </div>
                  <Badge variant={inq.status}>{t(`admin.inquiries.statuses.${inq.status}`)}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
