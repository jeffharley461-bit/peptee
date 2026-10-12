import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTestReports } from '../../hooks/useTestReports'
import { supabase } from '../../lib/supabase'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import TestReportForm from '../../components/admin/TestReportForm'
import Badge from '../../components/ui/Badge'
import toast from 'react-hot-toast'
import {
  PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon, XMarkIcon, DocumentTextIcon,
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
  const { reports, loading, refetch } = useTestReports({ search })
  const [modalOpen, setModalOpen] = useState(false)
  const [editReport, setEditReport] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const openAdd = () => { setEditReport(null); setModalOpen(true) }
  const openEdit = r => { setEditReport(r); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditReport(null) }

  const handleDelete = async () => {
    setDeleting(true)
    const { error } = await supabase.from('test_reports').delete().eq('id', deleteId)
    setDeleting(false)
    setDeleteId(null)
    if (error) toast.error(error.message)
    else { toast.success(t('admin.testReports.deleteSuccess')); refetch() }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('admin.testReports.title')}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('admin.testReports.subtitle')}</p>
        </div>
        <Button onClick={openAdd} size="sm">
          <PlusIcon className="h-4 w-4" /> {t('admin.testReports.add')}
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-xs">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t('admin.testReports.search')}
          className="input pl-10 pr-8"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : reports.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <DocumentTextIcon className="h-16 w-16 mx-auto mb-3 opacity-30" />
          <p>{t('common.noData')}</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[680px]">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('admin.testReports.product')}</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('admin.testReports.batch')}</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('admin.testReports.purity')}</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">{t('admin.testReports.tested')}</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('admin.testReports.status')}</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('admin.products.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {reports.map(r => (
                <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 dark:text-white">{r.product_name}</p>
                    {r.method && <p className="text-xs text-gray-400">{r.method}</p>}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{r.batch_number || '—'}</td>
                  <td className="px-4 py-3 font-semibold text-primary">{r.purity_percent != null ? `${r.purity_percent}%` : '—'}</td>
                  <td className="px-4 py-3 hidden sm:table-cell text-gray-500 dark:text-gray-400">{formatDate(r.tested_on || r.created_at)}</td>
                  <td className="px-4 py-3">
                    {r.is_published ? <Badge variant="completed">Published</Badge> : <Badge variant="archived">Draft</Badge>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(r)} className="p-1.5 text-gray-400 hover:text-primary rounded transition-colors">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button onClick={() => setDeleteId(r.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded transition-colors">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editReport ? t('admin.testReports.form.editTitle') : t('admin.testReports.form.title')}
        size="xl"
      >
        <TestReportForm
          report={editReport}
          onSuccess={() => { closeModal(); refetch() }}
          onCancel={closeModal}
        />
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title={t('admin.testReports.confirmDelete')} size="sm">
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{t('admin.testReports.confirmDelete')}</p>
        <div className="flex gap-3">
          <Button variant="danger" loading={deleting} onClick={handleDelete} className="flex-1">
            {t('admin.testReports.delete')}
          </Button>
          <Button variant="outline" onClick={() => setDeleteId(null)} className="flex-1">
            {t('common.cancel')}
          </Button>
        </div>
      </Modal>
    </div>
  )
}