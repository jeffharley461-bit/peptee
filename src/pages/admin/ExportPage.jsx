import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../lib/supabase'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import toast from 'react-hot-toast'
import Papa from 'papaparse'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { ArrowDownTrayIcon, DocumentArrowDownIcon, TableCellsIcon } from '@heroicons/react/24/outline'

function downloadCSV(data, filename) {
  const csv  = Papa.unparse(data)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = Object.assign(document.createElement('a'), { href: url, download: filename })
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function ExportPage() {
  const { t } = useTranslation()
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo,   setDateTo]   = useState('')
  const [loading, setLoading]   = useState({ inquiriesCSV: false, productsCSV: false, pdf: false })

  const setLoad = (key, val) => setLoading(l => ({ ...l, [key]: val }))

  const exportInquiriesCSV = async () => {
    setLoad('inquiriesCSV', true)
    let q = supabase.from('inquiries').select('*, products(name)').order('created_at', { ascending: false })
    if (dateFrom) q = q.gte('created_at', dateFrom)
    if (dateTo)   q = q.lte('created_at', dateTo + 'T23:59:59')
    const { data, error } = await q
    setLoad('inquiriesCSV', false)
    if (error) return toast.error(error.message)
    const rows = (data || []).map(i => ({
      Date: new Date(i.created_at).toLocaleDateString(),
      Name: i.customer_name,
      Email: i.email,
      Phone: i.phone || '',
      WhatsApp: i.whatsapp_number || '',
      Peptide: i.products?.name || '',
      Status: i.status,
      Details: i.project_details || '',
      'Admin Notes': i.admin_notes || '',
    }))
    downloadCSV(rows, `inquiries_${Date.now()}.csv`)
    toast.success(t('admin.export.success'))
  }

  const exportProductsCSV = async () => {
    setLoad('productsCSV', true)
    const { data, error } = await supabase.from('products').select('*, categories(name)').order('created_at')
    setLoad('productsCSV', false)
    if (error) return toast.error(error.message)
    const rows = (data || []).map(p => ({
      Name: p.name,
      Category: p.categories?.name || '',
      Description: p.description || '',
      Purity: p.purity_percent || '',
      'MW': `${p.molecular_weight || ''} ${p.molecular_weight_unit || ''}`,
      Sequence: p.amino_acid_sequence || '',
      Price: p.price_usd || '',
      Applications: (p.applications || []).join(', '),
      'Image URL': p.image_url || '',
    }))
    downloadCSV(rows, `products_${Date.now()}.csv`)
    toast.success(t('admin.export.success'))
  }

  const generatePDF = async () => {
    setLoad('pdf', true)
    let q = supabase.from('inquiries').select('*, products(name)').order('created_at', { ascending: false })
    if (dateFrom) q = q.gte('created_at', dateFrom)
    if (dateTo)   q = q.lte('created_at', dateTo + 'T23:59:59')
    const [{ data: inquiries }, { count: totalProducts }] = await Promise.all([
      q,
      supabase.from('products').select('*', { count: 'exact', head: true }),
    ])
    setLoad('pdf', false)

    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()

    // Header
    doc.setFontSize(20)
    doc.setTextColor('#0ea5e9')
    doc.text('PeptideForge', 14, 22)
    doc.setFontSize(11)
    doc.setTextColor('#6b7280')
    doc.text('Business Performance Report', 14, 30)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 37)
    if (dateFrom || dateTo) {
      doc.text(`Period: ${dateFrom || 'All'} to ${dateTo || 'All'}`, 14, 44)
    }

    // Summary
    doc.setFontSize(13)
    doc.setTextColor('#111827')
    doc.text('Summary', 14, 55)
    doc.setFontSize(10)
    doc.setTextColor('#6b7280')
    doc.text(`Total Products: ${totalProducts || 0}`, 14, 63)
    doc.text(`Total Inquiries: ${(inquiries || []).length}`, 14, 70)
    const responded = (inquiries || []).filter(i => i.status !== 'pending').length
    doc.text(`Response Rate: ${(inquiries || []).length > 0 ? Math.round(responded / (inquiries || []).length * 100) : 0}%`, 14, 77)

    // Table
    autoTable(doc, {
      startY: 90,
      head: [['Date', 'Customer', 'Email', 'Peptide', 'Status']],
      body: (inquiries || []).slice(0, 50).map(i => [
        new Date(i.created_at).toLocaleDateString(),
        i.customer_name,
        i.email,
        i.products?.name || '—',
        i.status,
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [14, 165, 233] },
    })

    doc.save(`peptideforge_report_${Date.now()}.pdf`)
    toast.success(t('admin.export.success'))
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">{t('admin.export.title')}</h1>

      {/* Date filter */}
      <Card className="mb-6">
        <h3 className="font-medium text-gray-900 dark:text-white mb-4">Date Range (optional)</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="label">{t('admin.export.dateFrom')}</label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="input" />
          </div>
          <div className="flex-1">
            <label className="label">{t('admin.export.dateTo')}</label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="input" />
          </div>
        </div>
      </Card>

      {/* Export buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card hover className="text-center">
          <TableCellsIcon className="h-10 w-10 text-primary mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{t('admin.export.inquiriesCSV')}</h3>
          <p className="text-xs text-gray-400 mb-4">Export all inquiries with customer info and status.</p>
          <Button onClick={exportInquiriesCSV} loading={loading.inquiriesCSV} variant="primary" className="w-full">
            <ArrowDownTrayIcon className="h-4 w-4" /> CSV
          </Button>
        </Card>

        <Card hover className="text-center">
          <TableCellsIcon className="h-10 w-10 text-accent mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{t('admin.export.productsCSV')}</h3>
          <p className="text-xs text-gray-400 mb-4">Export full product catalog with specs.</p>
          <Button onClick={exportProductsCSV} loading={loading.productsCSV} variant="accent" className="w-full">
            <ArrowDownTrayIcon className="h-4 w-4" /> CSV
          </Button>
        </Card>

        <Card hover className="text-center">
          <DocumentArrowDownIcon className="h-10 w-10 text-emerald-500 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{t('admin.export.pdfReport')}</h3>
          <p className="text-xs text-gray-400 mb-4">Generate a formatted PDF business report.</p>
          <Button onClick={generatePDF} loading={loading.pdf} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
            <DocumentArrowDownIcon className="h-4 w-4" /> PDF
          </Button>
        </Card>
      </div>
    </div>
  )
}
