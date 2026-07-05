import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useProduct, useProducts } from '../hooks/useProducts'
import { useSettings } from '../hooks/useSettings'
import { useCart } from '../store/CartContext'
import { supabase } from '../lib/supabase'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Spinner from '../components/ui/Spinner'
import toast from 'react-hot-toast'
import { ArrowLeftIcon, BeakerIcon, ChevronLeftIcon, ChevronRightIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import { WhatsAppLogo, GmailLogo } from '../components/icons/BrandIcons'

function ImageGallery({ images, name }) {
  const [idx, setIdx] = useState(0)
  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center">
        <BeakerIcon className="h-24 w-24 text-primary/20" />
      </div>
    )
  }
  return (
    <div className="relative">
      <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img src={images[idx]} alt={`${name} ${idx + 1}`} className="w-full h-full object-cover" />
      </div>
      {images.length > 1 && (
        <>
          <button
            onClick={() => setIdx(i => (i - 1 + images.length) % images.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-gray-900/80 rounded-full shadow hover:bg-white dark:hover:bg-gray-900"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => setIdx(i => (i + 1) % images.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-gray-900/80 rounded-full shadow hover:bg-white dark:hover:bg-gray-900"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
          <div className="flex gap-2 mt-3 justify-center">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`w-2 h-2 rounded-full transition-colors ${i === idx ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function InquiryModal({ isOpen, onClose, product }) {
  const { t } = useTranslation()
  const { settings } = useSettings()
  const [form, setForm] = useState({
    customer_name: '', email: '', phone: '', whatsapp_number: '', project_details: ''
  })
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const buildMessage = () => [
    `🧬 *New Order Inquiry — PeptideForge*`,
    ``,
    `📦 *Peptide Requested*`,
    `   • Name: ${product?.name || 'General Inquiry'}`,
    product?.purity_percent ? `   • Purity: ${product.purity_percent}%` : null,
    product?.molecular_weight ? `   • Mol. Weight: ${product.molecular_weight} ${product.molecular_weight_unit || 'Da'}` : null,
    product?.amino_acid_sequence ? `   • Sequence: ${product.amino_acid_sequence}` : null,
    product?.price_usd ? `   • Unit Price: $${product.price_usd} USD` : null,
    ``,
    `👤 *Client Details*`,
    `   • Name: ${form.customer_name}`,
    `   • Email: ${form.email}`,
    form.phone ? `   • Phone: ${form.phone}` : null,
    form.whatsapp_number ? `   • WhatsApp: ${form.whatsapp_number}` : null,
    ``,
    form.project_details
      ? `📋 *Project Details & Requirements*\n${form.project_details.split('\n').map(l => `   ${l}`).join('\n')}`
      : null,
    file ? `📎 *Document Attached:* ${file.name}` : null,
    ``,
    `⏰ *Submitted:* ${new Date().toLocaleString()}`,
    `🌐 *Source:* PeptideForge Platform`,
  ].filter(line => line !== null).join('\n')

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      let document_url = null
      if (file) {
        const fname = `${Date.now()}_${file.name.replace(/\s/g, '_')}`
        const { error: uploadErr } = await supabase.storage
          .from('inquiry-documents')
          .upload(fname, file)
        if (!uploadErr) {
          const { data: { publicUrl } } = supabase.storage.from('inquiry-documents').getPublicUrl(fname)
          document_url = publicUrl
        }
      }

      const { error } = await supabase.from('inquiries').insert({
        ...form,
        product_id: product?.id || null,
        document_url,
        status: 'pending',
      })

      if (error) throw error
      toast.success(t('inquiry.success'))
      setSubmitted(true)
    } catch (err) {
      toast.error(t('inquiry.error'))
    } finally {
      setLoading(false)
    }
  }

  const handleWhatsApp = () => {
    const phone = (settings?.whatsapp_number || '').replace(/\D/g, '')
    if (!phone) { toast.error('WhatsApp number not configured. Please contact us via email.'); return }
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(buildMessage())}`, '_blank')
  }

  const handleEmail = () => {
    const to = settings?.company_email || 'jeffharley461@gmail.com'
    const subject = `New Order Inquiry – ${product?.name || 'General'} | PeptideForge`
    const body = buildMessage()
      .replace(/\*/g, '')
      .replace(/🧬|📦|👤|📋|📎|⏰|🌐/gu, '')
      .replace(/^\s+/gm, '')
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setSubmitted(false)
      setForm({ customer_name: '', email: '', phone: '', whatsapp_number: '', project_details: '' })
      setFile(null)
    }, 300)
  }

  if (submitted) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Order Inquiry Received" size="md">
        <div className="text-center py-2">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Your inquiry is saved!</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Now send your order details to our team via WhatsApp or email — they're pre-filled with everything we need.
          </p>

          {product && (
            <div className="mb-5 p-3 bg-primary/5 border border-primary/20 rounded-lg text-xs text-primary text-left">
              <span className="font-semibold">{product.name}</span>
              {product.purity_percent && <span className="ml-2 text-gray-500">· Purity {product.purity_percent}%</span>}
              {product.price_usd && <span className="ml-2 text-gray-500">· ${product.price_usd} USD</span>}
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleWhatsApp}
              className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white rounded-xl font-semibold transition-colors shadow-md shadow-green-500/20"
            >
              <WhatsAppLogo className="h-5 w-5 flex-shrink-0" />
              Send via WhatsApp
            </button>

            <button
              onClick={handleEmail}
              className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl font-semibold transition-colors shadow-md shadow-blue-600/20"
            >
              <GmailLogo className="h-5 w-5 flex-shrink-0" />
              Send via Email
            </button>

            <button
              onClick={handleClose}
              className="w-full px-5 py-3 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Done
            </button>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
            Your inquiry is stored in our system. We respond within 24 hours.
          </p>
        </div>
      </Modal>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('inquiry.title')} size="lg">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{t('inquiry.subtitle')}</p>
      {product && (
        <div className="mb-5 p-3 bg-primary/5 border border-primary/20 rounded-lg text-sm text-primary">
          Peptide: <strong>{product.name}</strong>
          {product.purity_percent && <span className="text-gray-500 ml-2">· Purity {product.purity_percent}%</span>}
          {product.price_usd && <span className="text-gray-500 ml-2">· ${product.price_usd} USD</span>}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">{t('inquiry.name')} *</label>
            <input name="customer_name" value={form.customer_name} onChange={handleChange} required placeholder={t('inquiry.namePlaceholder')} className="input" />
          </div>
          <div>
            <label className="label">{t('inquiry.email')} *</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder={t('inquiry.emailPlaceholder')} className="input" />
          </div>
          <div>
            <label className="label">{t('inquiry.phone')}</label>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder={t('inquiry.phonePlaceholder')} className="input" />
          </div>
          <div>
            <label className="label">{t('inquiry.whatsapp')}</label>
            <input name="whatsapp_number" value={form.whatsapp_number} onChange={handleChange} placeholder={t('inquiry.whatsappPlaceholder')} className="input" />
          </div>
        </div>
        <div>
          <label className="label">{t('inquiry.details')} *</label>
          <textarea name="project_details" value={form.project_details} onChange={handleChange} required rows={4} placeholder={t('inquiry.detailsPlaceholder')} className="input resize-none" />
        </div>
        <div>
          <label className="label">{t('inquiry.document')}</label>
          <input
            type="file"
            accept=".pdf,.docx,.doc"
            onChange={e => setFile(e.target.files[0])}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
          />
          <p className="text-xs text-gray-400 mt-1">{t('inquiry.documentHint')}</p>
        </div>
        <Button type="submit" loading={loading} className="w-full" size="lg">
          {loading ? t('inquiry.submitting') : t('inquiry.submit')}
        </Button>
      </form>
    </Modal>
  )
}

export default function PeptideDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams()
  const { product, loading } = useProduct(id)
  const { products: related } = useProducts({ category: product?.category_id })
  const { addToCart } = useCart()
  const [inquiryOpen, setInquiryOpen] = useState(false)

  if (loading) return <div className="flex justify-center py-32"><Spinner size="lg" /></div>
  if (!product) return (
    <div className="text-center py-32">
      <p className="text-gray-500">Product not found.</p>
      <Link to="/catalog" className="text-primary hover:underline mt-2 inline-block">Back to catalog</Link>
    </div>
  )

  const images = product.image_url ? [product.image_url] : []
  const relatedProducts = related.filter(p => p.id !== product.id).slice(0, 4)

  const specs = [
    { label: t('peptide.name'),            value: product.name },
    { label: t('peptide.category'),        value: product.categories?.name },
    { label: t('peptide.purity'),          value: `${product.purity_percent}%` },
    { label: t('peptide.molecularWeight'), value: `${product.molecular_weight} ${product.molecular_weight_unit}` },
    { label: t('peptide.price'),           value: `$${product.price_usd} USD` },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back link */}
      <Link to="/catalog" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary mb-8 transition-colors">
        <ArrowLeftIcon className="h-4 w-4" /> {t('peptide.backToCatalog')}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        {/* Gallery */}
        <div>
          <ImageGallery images={images} name={product.name} />
        </div>

        {/* Details */}
        <div>
          <span className="text-sm text-primary font-medium">{product.categories?.name}</span>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-2 mb-4">{product.name}</h1>

          <div className="text-3xl font-extrabold text-primary mb-6">${product.price_usd} <span className="text-lg text-gray-400 font-normal">USD</span></div>

          {product.description && (
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">{product.description}</p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <button
              onClick={() => { addToCart(product); toast.success(`${product.name} added to cart`) }}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
            >
              <ShoppingCartIcon className="h-5 w-5" />
              Add to Cart
            </button>
            <Button
              onClick={() => setInquiryOpen(true)}
              variant="secondary"
              size="lg"
              className="flex-1 sm:flex-none"
            >
              {t('peptide.requestQuote')}
            </Button>
          </div>

          {/* Specs table */}
          <Card>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{t('peptide.specifications')}</h3>
            <dl className="space-y-3">
              {specs.map(s => s.value && (
                <div key={s.label} className="flex justify-between text-sm py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <dt className="text-gray-500 dark:text-gray-400">{s.label}</dt>
                  <dd className="font-medium text-gray-900 dark:text-white text-right max-w-[60%]">{s.value}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      </div>

      {/* Sequence */}
      {product.amino_acid_sequence && (
        <Card className="mb-10">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{t('peptide.sequence')}</h3>
          <code className="text-sm text-gray-700 dark:text-gray-300 font-mono break-all leading-loose">
            {product.amino_acid_sequence}
          </code>
        </Card>
      )}

      {/* Applications */}
      {product.applications && product.applications.length > 0 && (
        <div className="mb-10">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{t('peptide.applications')}</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {product.applications.map((app, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="text-primary">✓</span> {app}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Related */}
      {relatedProducts.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-5">{t('peptide.relatedPeptides')}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedProducts.map(p => (
              <Link key={p.id} to={`/peptide/${p.id}`}>
                <Card hover padding={false} className="overflow-hidden">
                  <div className="aspect-video bg-primary-50 dark:bg-gray-700 flex items-center justify-center">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <BeakerIcon className="h-8 w-8 text-primary/20" />
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{p.name}</p>
                    <p className="text-xs text-primary font-bold mt-1">${p.price_usd}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} product={product} />
    </div>
  )
}
