import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import toast from 'react-hot-toast'
import {
  PencilIcon, TrashIcon, PlusIcon, XMarkIcon,
  CheckIcon, ArrowUpTrayIcon, CurrencyDollarIcon,
} from '@heroicons/react/24/outline'

function parseLine(line) {
  const raw = line.trim()
  if (!raw || raw.startsWith('#')) return null
  const parts = raw.includes('\t')
    ? raw.split('\t').map(p => p.trim())
    : raw.split(',').map(p => p.trim())

  let name, unit = null, price_usd, category = null, notes = null

  if (parts.length === 2) {
    [name] = parts
    price_usd = parseFloat(parts[1].replace(/[$,\s]/g, ''))
  } else if (parts.length === 3) {
    [name, unit] = parts
    price_usd = parseFloat(parts[2].replace(/[$,\s]/g, ''))
  } else if (parts.length >= 4) {
    [name, unit, , category] = parts
    price_usd = parseFloat(parts[2].replace(/[$,\s]/g, ''))
    notes = parts[4]?.trim() || null
  } else {
    return null
  }

  if (!name || isNaN(price_usd) || price_usd <= 0) return null
  return {
    name,
    unit:     unit?.trim()     || null,
    price_usd,
    category: category?.trim() || null,
    notes,
  }
}

function ItemRow({ item, onEdit, onDelete }) {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <td className="px-4 py-3">
        <p className="font-medium text-gray-900 dark:text-white text-sm">{item.name}</p>
        {item.notes && <p className="text-xs text-gray-400 mt-0.5">{item.notes}</p>}
      </td>
      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{item.category || '—'}</td>
      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{item.unit || '—'}</td>
      <td className="px-4 py-3 text-sm font-semibold text-primary">
        ${parseFloat(item.price_usd).toFixed(2)}
      </td>
      <td className="px-4 py-3">
        <Badge variant={item.in_stock ? 'success' : 'default'}>
          {item.in_stock ? 'In Stock' : 'Out of Stock'}
        </Badge>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex justify-end gap-1">
          <button
            onClick={() => onEdit(item)}
            className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(item)}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}

function ItemForm({ initial, onSave, onCancel, loading }) {
  const [form, setForm] = useState({
    name: '', category: '', unit: '', price_usd: '', notes: '', in_stock: true,
    ...initial,
    price_usd: initial?.price_usd?.toString() ?? '',
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const valid = form.name.trim() && form.price_usd && !isNaN(parseFloat(form.price_usd))

  const save = () => {
    if (!valid) return
    onSave({
      ...form,
      price_usd: parseFloat(form.price_usd),
      category:  form.category.trim()  || null,
      unit:      form.unit.trim()      || null,
      notes:     form.notes.trim()     || null,
    })
  }

  return (
    <tr className="bg-primary/5 dark:bg-primary/10">
      <td colSpan={6} className="px-4 py-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-2">
          <input
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="Peptide name *"
            className="input text-sm col-span-2 lg:col-span-2"
            autoFocus
          />
          <input
            value={form.category}
            onChange={e => set('category', e.target.value)}
            placeholder="Category"
            className="input text-sm"
          />
          <input
            value={form.unit}
            onChange={e => set('unit', e.target.value)}
            placeholder="Unit (e.g. 5mg)"
            className="input text-sm"
          />
          <input
            value={form.price_usd}
            onChange={e => set('price_usd', e.target.value)}
            placeholder="Price USD *"
            type="number"
            step="0.01"
            min="0"
            className="input text-sm"
          />
          <input
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
            placeholder="Notes (optional)"
            className="input text-sm"
          />
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.in_stock}
              onChange={e => set('in_stock', e.target.checked)}
              className="rounded"
            />
            In Stock
          </label>
          <Button onClick={save} loading={loading} size="sm" className="flex items-center gap-1.5">
            <CheckIcon className="h-4 w-4" />
            {initial?.id ? 'Save Changes' : 'Add Item'}
          </Button>
          <Button onClick={onCancel} variant="secondary" size="sm">
            <XMarkIcon className="h-4 w-4" />
            Cancel
          </Button>
        </div>
      </td>
    </tr>
  )
}

export default function AdminPriceListPage() {
  const [items,     setItems]     = useState([])
  const [loading,   setLoading]   = useState(true)
  const [saving,    setSaving]    = useState(false)
  const [adding,    setAdding]    = useState(false)
  const [editing,   setEditing]   = useState(null)
  const [deleting,  setDeleting]  = useState(null)
  const [pasteText, setPasteText] = useState('')
  const [importing, setImporting] = useState(false)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('price_list')
      .select('*')
      .order('category', { nullsFirst: false })
      .order('name')
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleAdd = async (form) => {
    setSaving(true)
    const { error } = await supabase.from('price_list').insert(form)
    setSaving(false)
    if (error) { toast.error(error.message); return }
    toast.success(`"${form.name}" added`)
    setAdding(false)
    load()
  }

  const handleEdit = async (form) => {
    setSaving(true)
    const { id, created_at, updated_at, ...updates } = form
    const { error } = await supabase.from('price_list').update(updates).eq('id', id)
    setSaving(false)
    if (error) { toast.error(error.message); return }
    toast.success('Item updated')
    setEditing(null)
    load()
  }

  const handleDelete = async (item) => {
    setSaving(true)
    const { error } = await supabase.from('price_list').delete().eq('id', item.id)
    setSaving(false)
    if (error) { toast.error(error.message); return }
    toast.success(`"${item.name}" deleted`)
    setDeleting(null)
    load()
  }

  const handleImport = async () => {
    const rows = pasteText.split('\n').map(parseLine).filter(Boolean)
    if (rows.length === 0) {
      toast.error('No valid rows found. Expected: Name, Unit, Price')
      return
    }
    setImporting(true)
    const { error } = await supabase.from('price_list').insert(rows)
    setImporting(false)
    if (error) { toast.error(error.message); return }
    toast.success(`${rows.length} item${rows.length !== 1 ? 's' : ''} imported successfully`)
    setPasteText('')
    load()
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Price List</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Publish all your peptide prices — including items not in the main catalog.
          Visible to visitors at <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">/price-list</code>.
        </p>
      </div>

      {/* Bulk paste import */}
      <Card className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <ArrowUpTrayIcon className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-gray-900 dark:text-white">Bulk Paste Import</h2>
        </div>
        <p className="text-xs text-gray-400 mb-3 leading-relaxed">
          Paste one item per line — works with comma-separated text or directly from Excel / Google Sheets (tab-separated).<br />
          Formats accepted:{' '}
          <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">Name, Price</code> ·{' '}
          <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">Name, Unit, Price</code> ·{' '}
          <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">Name, Unit, Price, Category</code>
        </p>
        <textarea
          value={pasteText}
          onChange={e => setPasteText(e.target.value)}
          rows={7}
          placeholder={
            'BPC-157, 5mg, 45\nTB-500, 2mg, 38\nGHK-Cu, 100mg, 120.50, Cosmetic Peptides\nGHRP-6, 5mg, 32, Research Peptides\nCJC-1295, 2mg, 55, Research Peptides'
          }
          className="input resize-y font-mono text-sm mb-3"
        />
        <Button
          onClick={handleImport}
          loading={importing}
          disabled={!pasteText.trim()}
          className="flex items-center gap-2"
        >
          <ArrowUpTrayIcon className="h-4 w-4" />
          Import Items
        </Button>
      </Card>

      {/* Live table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900 dark:text-white text-sm">
            All Items{' '}
            <span className="text-gray-400 font-normal">({items.length})</span>
          </h2>
          {!adding && (
            <Button
              onClick={() => { setAdding(true); setEditing(null) }}
              size="sm"
              className="flex items-center gap-1.5"
            >
              <PlusIcon className="h-4 w-4" />
              Add Item
            </Button>
          )}
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Unit</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {adding && (
                  <ItemForm
                    onSave={handleAdd}
                    onCancel={() => setAdding(false)}
                    loading={saving}
                  />
                )}
                {items.length === 0 && !adding ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center">
                      <CurrencyDollarIcon className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">
                        No items yet. Use Bulk Import above or click "Add Item".
                      </p>
                    </td>
                  </tr>
                ) : (
                  items.map(item =>
                    editing?.id === item.id ? (
                      <ItemForm
                        key={item.id}
                        initial={editing}
                        onSave={handleEdit}
                        onCancel={() => setEditing(null)}
                        loading={saving}
                      />
                    ) : deleting?.id === item.id ? (
                      <tr key={item.id} className="bg-red-50 dark:bg-red-900/20">
                        <td colSpan={6} className="px-4 py-3">
                          <div className="flex items-center gap-3 flex-wrap">
                            <p className="text-sm text-red-700 dark:text-red-300 flex-1">
                              Delete <strong>"{item.name}"</strong>? This cannot be undone.
                            </p>
                            <Button
                              size="sm"
                              loading={saving}
                              onClick={() => handleDelete(item)}
                              className="bg-red-500 hover:bg-red-600 border-red-500"
                            >
                              Delete
                            </Button>
                            <Button size="sm" variant="secondary" onClick={() => setDeleting(null)}>
                              Cancel
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <ItemRow
                        key={item.id}
                        item={item}
                        onEdit={i => { setEditing(i); setAdding(false) }}
                        onDelete={i => setDeleting(i)}
                      />
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
