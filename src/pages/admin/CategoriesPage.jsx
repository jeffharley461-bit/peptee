import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import toast from 'react-hot-toast'
import { PencilIcon, TrashIcon, PlusIcon, TagIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline'

const SUGGESTED = [
  { name: 'Research Peptides',    description: 'For laboratory and academic research use' },
  { name: 'Cosmetic Peptides',    description: 'Anti-aging and skin care applications' },
  { name: 'Performance Peptides', description: 'Athletic recovery and performance enhancement' },
  { name: 'Therapeutic Peptides', description: 'Medical and pharmaceutical grade applications' },
  { name: 'Custom Peptides',      description: 'Fully custom sequences and modifications' },
  { name: 'Growth Peptides',      description: 'GH secretagogues and growth-related compounds' },
  { name: 'Nootropic Peptides',   description: 'Cognitive enhancement and neuroprotection' },
  { name: 'Weight Management',    description: 'Metabolic and appetite-regulating peptides' },
]

function CategoryRow({ category, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <TagIcon className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 dark:text-white text-sm">{category.name}</p>
        {category.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{category.description}</p>
        )}
      </div>
      <span className="text-xs text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full flex-shrink-0">
        {category.product_count ?? 0} product{category.product_count !== 1 ? 's' : ''}
      </span>
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => onEdit(category)}
          className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
        >
          <PencilIcon className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(category)}
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

function CategoryForm({ initial, onSave, onCancel, loading }) {
  const [form, setForm] = useState({ name: '', description: '', ...initial })
  return (
    <div className="p-4 border-2 border-primary/20 bg-primary/5 dark:bg-primary/10 rounded-xl space-y-3">
      <div>
        <label className="label">Category Name *</label>
        <input
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          placeholder="e.g. Research Peptides"
          className="input"
          autoFocus
        />
      </div>
      <div>
        <label className="label">Description</label>
        <input
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          placeholder="Brief description of this category"
          className="input"
        />
      </div>
      <div className="flex gap-2">
        <Button
          onClick={() => form.name.trim() && onSave(form)}
          loading={loading}
          size="sm"
          className="flex items-center gap-1.5"
        >
          <CheckIcon className="h-4 w-4" />
          {initial?.id ? 'Save Changes' : 'Add Category'}
        </Button>
        <Button onClick={onCancel} variant="secondary" size="sm">
          <XMarkIcon className="h-4 w-4" />
          Cancel
        </Button>
      </div>
    </div>
  )
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [saving,     setSaving]     = useState(false)
  const [adding,     setAdding]     = useState(false)
  const [editing,    setEditing]    = useState(null)
  const [deleting,   setDeleting]   = useState(null)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('categories')
      .select('*, products(count)')
      .order('name')
    setCategories(
      (data || []).map(c => ({ ...c, product_count: c.products?.[0]?.count ?? 0 }))
    )
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleAdd = async (form) => {
    setSaving(true)
    const { error } = await supabase.from('categories').insert({ name: form.name.trim(), description: form.description.trim() || null })
    setSaving(false)
    if (error) { toast.error(error.message); return }
    toast.success(`"${form.name}" added`)
    setAdding(false)
    load()
  }

  const handleEdit = async (form) => {
    setSaving(true)
    const { error } = await supabase.from('categories').update({ name: form.name.trim(), description: form.description.trim() || null }).eq('id', form.id)
    setSaving(false)
    if (error) { toast.error(error.message); return }
    toast.success('Category updated')
    setEditing(null)
    load()
  }

  const handleDelete = async (category) => {
    if (category.product_count > 0) {
      toast.error(`Cannot delete — ${category.product_count} product(s) use this category. Reassign them first.`)
      return
    }
    setSaving(true)
    const { error } = await supabase.from('categories').delete().eq('id', category.id)
    setSaving(false)
    if (error) { toast.error(error.message); return }
    toast.success(`"${category.name}" deleted`)
    setDeleting(null)
    load()
  }

  const handleAddSuggested = async (suggestion) => {
    const exists = categories.some(c => c.name.toLowerCase() === suggestion.name.toLowerCase())
    if (exists) { toast.error('Category already exists'); return }
    await handleAdd(suggestion)
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Organize your peptides — clients filter by category in the catalog.
          </p>
        </div>
        {!adding && (
          <Button onClick={() => { setAdding(true); setEditing(null) }} className="flex items-center gap-2">
            <PlusIcon className="h-4 w-4" />
            Add Category
          </Button>
        )}
      </div>

      {/* Add form */}
      {adding && (
        <div className="mb-6">
          <CategoryForm
            onSave={handleAdd}
            onCancel={() => setAdding(false)}
            loading={saving}
          />
        </div>
      )}

      {/* Category list */}
      <Card className="mb-8">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm">
          Your Categories <span className="text-gray-400 font-normal">({categories.length})</span>
        </h2>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />)}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-10">
            <TagIcon className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No categories yet. Add one above or use a suggestion below.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {categories.map(cat => (
              editing?.id === cat.id ? (
                <CategoryForm
                  key={cat.id}
                  initial={editing}
                  onSave={handleEdit}
                  onCancel={() => setEditing(null)}
                  loading={saving}
                />
              ) : deleting?.id === cat.id ? (
                <div key={cat.id} className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <p className="text-sm text-red-700 dark:text-red-300 flex-1">
                    Delete <strong>"{cat.name}"</strong>? This cannot be undone.
                  </p>
                  <Button size="sm" onClick={() => handleDelete(cat)} loading={saving} className="bg-red-500 hover:bg-red-600 border-red-500">
                    Delete
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => setDeleting(null)}>Cancel</Button>
                </div>
              ) : (
                <CategoryRow
                  key={cat.id}
                  category={cat}
                  onEdit={c => { setEditing(c); setAdding(false) }}
                  onDelete={c => setDeleting(c)}
                />
              )
            ))}
          </div>
        )}
      </Card>

      {/* Suggested categories */}
      <Card>
        <h2 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm">Suggested Categories</h2>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
          Common peptide business categories — click to add any you don't have yet.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SUGGESTED.map(s => {
            const exists = categories.some(c => c.name.toLowerCase() === s.name.toLowerCase())
            return (
              <button
                key={s.name}
                onClick={() => !exists && handleAddSuggested(s)}
                disabled={exists}
                className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                  exists
                    ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 cursor-default'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-primary/5 cursor-pointer'
                }`}
              >
                <span className={`mt-0.5 flex-shrink-0 ${exists ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`}>
                  {exists ? <CheckIcon className="h-4 w-4" /> : <PlusIcon className="h-4 w-4" />}
                </span>
                <div>
                  <p className={`text-xs font-semibold ${exists ? 'text-green-700 dark:text-green-400' : 'text-gray-800 dark:text-gray-200'}`}>
                    {s.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.description}</p>
                </div>
              </button>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
