import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useProducts } from '../../hooks/useProducts'
import { supabase } from '../../lib/supabase'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import ProductForm from '../../components/admin/ProductForm'
import toast from 'react-hot-toast'
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon, BeakerIcon } from '@heroicons/react/24/outline'

export default function ProductsPage() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const { products, loading, refetch } = useProducts({ search })
  const [modalOpen, setModalOpen]   = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [deleteId, setDeleteId]     = useState(null)
  const [deleting, setDeleting]     = useState(false)

  const openAdd  = () => { setEditProduct(null); setModalOpen(true) }
  const openEdit = p => { setEditProduct(p); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditProduct(null) }

  const handleDelete = async () => {
    setDeleting(true)
    const { error } = await supabase.from('products').delete().eq('id', deleteId)
    setDeleting(false)
    setDeleteId(null)
    if (error) toast.error(error.message)
    else { toast.success(t('admin.products.deleteSuccess')); refetch() }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('admin.products.title')}</h1>
        <Button onClick={openAdd} size="sm">
          <PlusIcon className="h-4 w-4" /> {t('admin.products.add')}
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-xs">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t('admin.products.search')}
          className="input pl-10"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <BeakerIcon className="h-16 w-16 mx-auto mb-3 opacity-30" />
          <p>{t('common.noData')}</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Image</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('admin.products.name')}</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">{t('admin.products.category')}</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">{t('admin.products.purity')}</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('admin.products.price')}</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('admin.products.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-4 py-3">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <BeakerIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 dark:text-white">{p.name}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-gray-500 dark:text-gray-400">
                    {p.categories?.name || '—'}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-gray-500 dark:text-gray-400">
                    {p.purity_percent ? `${p.purity_percent}%` : '—'}
                  </td>
                  <td className="px-4 py-3 font-semibold text-primary">
                    ${p.price_usd}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 text-gray-400 hover:text-primary rounded transition-colors">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button onClick={() => setDeleteId(p.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded transition-colors">
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
        title={editProduct ? t('admin.products.form.editTitle') : t('admin.products.form.title')}
        size="xl"
      >
        <ProductForm
          product={editProduct}
          onSuccess={() => { closeModal(); refetch() }}
          onCancel={closeModal}
        />
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title={t('admin.products.confirmDelete')} size="sm">
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{t('admin.products.confirmDelete')}</p>
        <div className="flex gap-3">
          <Button variant="danger" loading={deleting} onClick={handleDelete} className="flex-1">
            {t('admin.products.delete')}
          </Button>
          <Button variant="outline" onClick={() => setDeleteId(null)} className="flex-1">
            {t('common.cancel')}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
