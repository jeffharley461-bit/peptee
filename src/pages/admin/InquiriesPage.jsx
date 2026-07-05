import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useInquiries } from '../../hooks/useInquiries'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Spinner from '../../components/ui/Spinner'
import toast from 'react-hot-toast'
import { MagnifyingGlassIcon, EyeIcon, TrashIcon } from '@heroicons/react/24/outline'

const STATUSES = ['pending', 'responded', 'completed', 'archived']

export default function InquiriesPage() {
  const { t } = useTranslation()
  const [filters, setFilters] = useState({ search: '', status: 'all' })
  const { inquiries, loading, updateInquiry, deleteInquiry, refetch } = useInquiries(
    filters.status !== 'all' ? { status: filters.status, search: filters.search } : { search: filters.search }
  )
  const [viewInquiry, setViewInquiry] = useState(null)
  const [noteText, setNoteText]       = useState('')
  const [deleteId, setDeleteId]       = useState(null)

  const handleStatusChange = async (id, status) => {
    const { error } = await updateInquiry(id, {
      status,
      responded_at: status === 'responded' ? new Date().toISOString() : undefined,
    })
    if (error) toast.error(error.message)
    else toast.success(t('admin.inquiries.updateSuccess'))
  }

  const handleSaveNote = async () => {
    const { error } = await updateInquiry(viewInquiry.id, { admin_notes: noteText })
    if (error) toast.error(error.message)
    else { toast.success(t('admin.inquiries.updateSuccess')); setViewInquiry(null) }
  }

  const handleDelete = async () => {
    const { error } = await deleteInquiry(deleteId)
    setDeleteId(null)
    if (error) toast.error(error.message)
    else toast.success(t('admin.inquiries.deleteSuccess'))
  }

  const openView = (inq) => { setViewInquiry(inq); setNoteText(inq.admin_notes || '') }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('admin.inquiries.title')}</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            placeholder={t('admin.inquiries.search')}
            className="input pl-9 text-sm"
          />
        </div>
        <select
          value={filters.status}
          onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
          className="input sm:w-44 text-sm"
        >
          <option value="all">{t('admin.inquiries.all')}</option>
          {STATUSES.map(s => (
            <option key={s} value={s}>{t(`admin.inquiries.statuses.${s}`)}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : inquiries.length === 0 ? (
        <p className="text-center py-16 text-gray-400 text-sm">{t('common.noData')}</p>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('admin.inquiries.date')}</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('admin.inquiries.customer')}</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">{t('admin.inquiries.peptide')}</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('admin.inquiries.status')}</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('admin.inquiries.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {inquiries.map(inq => (
                <tr key={inq.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap text-xs">
                    {new Date(inq.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{inq.customer_name}</p>
                    <p className="text-xs text-gray-400">{inq.email}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-gray-500 dark:text-gray-400 text-xs">
                    {inq.products?.name || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={inq.status}
                      onChange={e => handleStatusChange(inq.id, e.target.value)}
                      className="text-xs border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      {STATUSES.map(s => (
                        <option key={s} value={s}>{t(`admin.inquiries.statuses.${s}`)}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openView(inq)} className="p-1.5 text-gray-400 hover:text-primary rounded">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button onClick={() => setDeleteId(inq.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded">
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

      {/* View Modal */}
      <Modal isOpen={!!viewInquiry} onClose={() => setViewInquiry(null)} title={t('admin.inquiries.view')} size="lg">
        {viewInquiry && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ['Name', viewInquiry.customer_name],
                ['Email', viewInquiry.email],
                ['Phone', viewInquiry.phone || '—'],
                ['WhatsApp', viewInquiry.whatsapp_number || '—'],
                ['Peptide', viewInquiry.products?.name || '—'],
                ['Date', new Date(viewInquiry.created_at).toLocaleDateString()],
              ].map(([label, val]) => (
                <div key={label}>
                  <span className="text-gray-400 block text-xs">{label}</span>
                  <span className="text-gray-900 dark:text-white font-medium">{val}</span>
                </div>
              ))}
            </div>
            <div>
              <span className="text-xs text-gray-400 block mb-1">Project Details</span>
              <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">{viewInquiry.project_details || '—'}</p>
            </div>
            {viewInquiry.document_url && (
              <a href={viewInquiry.document_url} target="_blank" rel="noopener" className="text-primary text-sm hover:underline">
                View attached document
              </a>
            )}
            <div>
              <label className="text-xs text-gray-400 block mb-1">{t('admin.inquiries.notes')}</label>
              <textarea value={noteText} onChange={e => setNoteText(e.target.value)} rows={3} className="input resize-none text-sm" />
            </div>
            <Button onClick={handleSaveNote} size="sm">{t('common.save')}</Button>
          </div>
        )}
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title={t('admin.inquiries.confirmDelete')} size="sm">
        <div className="flex gap-3 mt-4">
          <Button variant="danger" onClick={handleDelete} className="flex-1">{t('admin.inquiries.delete')}</Button>
          <Button variant="outline" onClick={() => setDeleteId(null)} className="flex-1">{t('common.cancel')}</Button>
        </div>
      </Modal>
    </div>
  )
}
