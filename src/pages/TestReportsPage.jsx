import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTestReports } from '../hooks/useTestReports'
import Spinner from '../components/ui/Spinner'
import {
  MagnifyingGlassIcon, XMarkIcon, DocumentTextIcon, ArrowDownTrayIcon, BeakerIcon,
} from '@heroicons/react/24/outline'

function formatDate(value) {
  if (!value) return '—'
  try {
    return new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return value
  }
}

export default function TestReportsPage() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const { reports, loading, error } = useTestReports({ publishedOnly: true, search })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
          {t('testReports.badge')}
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          {t('testReports.title')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
          {t('testReports.subtitle')}
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-8 max-w-md">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t('testReports.search')}
          className="input pl-10 pr-8"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><Spinner size="lg" /></div>
      ) : error ? (
        <div className="text-center py-24 text-gray-400">
          <BeakerIcon className="h-16 w-16 mx-auto mb-3 opacity-30" />
          <p>{t('common.error')}</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-24">
          <DocumentTextIcon className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">{t('testReports.empty')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map(report => (
            <div
              key={report.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 flex flex-col"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0 p-2.5 rounded-xl bg-primary/10 text-primary">
                  <DocumentTextIcon className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white leading-snug truncate">
                    {report.product_name}
                  </h3>
                  {report.batch_number && (
                    <p className="text-xs text-gray-400 mt-0.5">Batch: {report.batch_number}</p>
                  )}
                </div>
              </div>

              <dl className="grid grid-cols-3 gap-3 text-center mb-5">
                <div className="rounded-lg bg-gray-50 dark:bg-gray-900 py-2">
                  <dt className="text-[10px] uppercase tracking-wider text-gray-400">{t('testReports.purity')}</dt>
                  <dd className="text-sm font-bold text-primary">{report.purity_percent != null ? `${report.purity_percent}%` : '—'}</dd>
                </div>
                <div className="rounded-lg bg-gray-50 dark:bg-gray-900 py-2">
                  <dt className="text-[10px] uppercase tracking-wider text-gray-400">{t('testReports.method')}</dt>
                  <dd className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate px-1">{report.method || '—'}</dd>
                </div>
                <div className="rounded-lg bg-gray-50 dark:bg-gray-900 py-2">
                  <dt className="text-[10px] uppercase tracking-wider text-gray-400">{t('testReports.testedOn')}</dt>
                  <dd className="text-xs font-medium text-gray-700 dark:text-gray-300">{formatDate(report.tested_on || report.created_at)}</dd>
                </div>
              </dl>

              {report.report_url ? (
                <a
                  href={report.report_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-600 transition-colors"
                >
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  {t('testReports.download')}
                </a>
              ) : (
                <span className="mt-auto inline-flex items-center justify-center text-xs text-gray-400 py-2.5 px-3 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
                  {t('testReports.noDocument') || 'Document Pending'}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="mt-10 text-center text-xs text-gray-400 max-w-2xl mx-auto">
        {t('testReports.disclaimer')}
      </p>
    </div>
  )
}
