import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useProducts } from '../../hooks/useProducts'
import { supabase } from '../../lib/supabase'
import Button from '../ui/Button'
import FileUploader from './FileUploader'
import toast from 'react-hot-toast'

const EMPTY = {
  product_id: '', product_name: '', batch_number: '',
  purity_percent: '', method: '', tested_on: '', report_url: '', is_published: true,
}

export default function TestReportForm({ report = null, onSuccess, onCancel }) {
  const { t } = useTranslation()
  const { products } = useProducts()
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const isEdit = !!report

  const grouped = products.reduce((acc, p) => {
    const key = p.categories?.name || 'Uncategorized'
    if (!acc[key]) acc[key] = []
    acc[key].push(p)
    return acc
  }, {})

  useEffect(() => {
    if (report) setForm({ ...EMPTY, ...report })
  }, [report])

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    const payload = {
      product_id:     form.product_id || null,
      product_name:   form.product_name.trim(),
      batch_number:   form.batch_number.trim() || null,
      purity_percent: form.purity_percent !== '' ? Number(form.purity_percent) : null,
      method:         form.method.trim() || null,
      tested_on:      form.tested_on || null,
      report_url:     form.report_url || null,
      is_published:   form.is_published,
    }

    const { error } = isEdit
      ? await supabase.from('test_reports').update(payload).eq('id', report.id)
      : await supabase.from('test_reports').insert(payload)

    setLoading(false)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success(t('admin.testReports.saveSuccess'))
      onSuccess?.()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="label">{t('admin.testReports.form.productName')} *</label>
          <input name="product_name" value={form.product_name} onChange={handleChange} required className="input" />
        </div>

        <div>
          <label className="label">{t('admin.testReports.form.product')}</label>
          <select name="product_id" value={form.product_id} onChange={handleChange} className="input">
            <option value="">— Not linked —</option>
            {Object.entries(grouped).map(([name, list]) => (
              <optgroup key={name} label={name}>
                {list.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div>
          <label className="label">{t('admin.testReports.form.batchNumber')}</label>
          <input name="batch_number" value={form.batch_number} onChange={handleChange} placeholder="e.g. BPC-157-B2025-01" className="input" />
        </div>

        <div>
          <label className="label">{t('admin.testReports.form.purity')}</label>
          <input name="purity_percent" type="number" min="0" max="100" step="0.01" value={form.purity_percent} onChange={handleChange} className="input" />
        </div>

        <div>
          <label className="label">{t('admin.testReports.form.method')}</label>
          <input name="method" value={form.method} onChange={handleChange} placeholder="e.g. HPLC, MS" className="input" />
        </div>

        <div>
          <label className="label">{t('admin.testReports.form.testedOn')}</label>
          <input name="tested_on" type="date" value={form.tested_on} onChange={handleChange} className="input" />
        </div>

        <div className="sm:col-span-2">
          <label className="label">{t('admin.testReports.form.reportUrl')}</label>
          <FileUploader value={form.report_url} onChange={url => setForm(f => ({ ...f, report_url: url || '' }))} />
        </div>

        <div className="sm:col-span-2">
          <label className="flex items-center gap-2.5 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              name="is_published"
              checked={form.is_published}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            {t('admin.testReports.form.published')}
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={loading} className="flex-1">
          {t('admin.testReports.form.save')}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('admin.testReports.form.cancel')}
        </Button>
      </div>
    </form>
  )
}