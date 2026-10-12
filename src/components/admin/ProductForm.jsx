import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useCategories } from '../../hooks/useCategories'
import { supabase } from '../../lib/supabase'
import Button from '../ui/Button'
import ImageUploader from './ImageUploader'
import toast from 'react-hot-toast'

const EMPTY = {
  name: '', category_id: '', description: '', applications: '',
  purity_percent: '', molecular_weight: '', molecular_weight_unit: 'Da',
  amino_acid_sequence: '', price_usd: '', image_url: '', stock_status: 'in_stock',
}

export default function ProductForm({ product = null, onSuccess, onCancel }) {
  const { t } = useTranslation()
  const { categories } = useCategories()
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const isEdit = !!product

  useEffect(() => {
    if (product) {
      setForm({
        ...EMPTY,
        ...product,
        applications: Array.isArray(product.applications) ? product.applications.join(', ') : '',
      })
    }
  }, [product])

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    const payload = {
      ...form,
      purity_percent:   form.purity_percent   ? Number(form.purity_percent)   : null,
      molecular_weight: form.molecular_weight ? Number(form.molecular_weight) : null,
      price_usd:        form.price_usd        ? Number(form.price_usd)        : null,
      applications:     form.applications
        ? form.applications.split(',').map(a => a.trim()).filter(Boolean)
        : [],
      category_id: form.category_id || null,
    }

    const { error } = isEdit
      ? await supabase.from('products').update(payload).eq('id', product.id)
      : await supabase.from('products').insert(payload)

    setLoading(false)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success(t('admin.products.saveSuccess'))
      onSuccess?.()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="label">{t('admin.products.form.name')} *</label>
          <input name="name" value={form.name} onChange={handleChange} required className="input" />
        </div>

        <div>
          <label className="label">{t('admin.products.form.category')}</label>
          <select name="category_id" value={form.category_id} onChange={handleChange} className="input">
            <option value="">— Select category —</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label className="label">{t('admin.products.form.price')} *</label>
          <input name="price_usd" type="number" step="0.01" min="0" value={form.price_usd} onChange={handleChange} required className="input" />
        </div>

        <div>
          <label className="label">{t('admin.products.form.purity')}</label>
          <input name="purity_percent" type="number" min="0" max="100" step="0.01" value={form.purity_percent} onChange={handleChange} className="input" />
        </div>

        <div>
          <label className="label">{t('admin.products.form.stockStatus')}</label>
          <select name="stock_status" value={form.stock_status} onChange={handleChange} className="input">
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="pre_order">Pre-Order</option>
          </select>
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <label className="label">{t('admin.products.form.molecularWeight')}</label>
            <input name="molecular_weight" type="number" step="0.0001" value={form.molecular_weight} onChange={handleChange} className="input" />
          </div>
          <div className="w-24">
            <label className="label">{t('admin.products.form.mwUnit')}</label>
            <select name="molecular_weight_unit" value={form.molecular_weight_unit} onChange={handleChange} className="input">
              <option>Da</option>
              <option>kDa</option>
            </select>
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="label">{t('admin.products.form.description')}</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="input resize-none" />
        </div>

        <div className="sm:col-span-2">
          <label className="label">{t('admin.products.form.sequence')}</label>
          <textarea name="amino_acid_sequence" value={form.amino_acid_sequence} onChange={handleChange} rows={2} className="input font-mono text-sm resize-none" />
        </div>

        <div className="sm:col-span-2">
          <label className="label">{t('admin.products.form.applications')}</label>
          <input name="applications" value={form.applications} onChange={handleChange} placeholder="Research, Therapy, Anti-aging" className="input" />
          <p className="text-xs text-gray-400 mt-1">Separate with commas</p>
        </div>
      </div>

      {/* Image upload */}
      <div>
        <label className="label">{t('admin.products.form.image')}</label>
        <ImageUploader value={form.image_url} onChange={url => setForm(f => ({ ...f, image_url: url || '' }))} />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={loading} className="flex-1">
          {t('admin.products.form.save')}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('admin.products.form.cancel')}
        </Button>
      </div>
    </form>
  )
}
