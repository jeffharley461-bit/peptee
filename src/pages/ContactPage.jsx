import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSettings } from '../hooks/useSettings'
import { supabase } from '../lib/supabase'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import toast from 'react-hot-toast'
import { WhatsAppLogo, GmailLogo } from '../components/icons/BrandIcons'

export default function ContactPage() {
  const { t } = useTranslation()
  const { settings } = useSettings()
  const [form, setForm] = useState({ customer_name: '', email: '', project_details: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const buildMessage = () => [
    `🧬 *New Contact Message — PeptideForge*`,
    ``,
    `👤 *Client Details*`,
    `   • Name: ${form.customer_name}`,
    `   • Email: ${form.email}`,
    ``,
    `📋 *Message*`,
    form.project_details.split('\n').map(l => `   ${l}`).join('\n'),
    ``,
    `⏰ *Submitted:* ${new Date().toLocaleString()}`,
    `🌐 *Source:* PeptideForge Contact Form`,
  ].join('\n')

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.from('inquiries').insert({ ...form, status: 'pending' })
    setLoading(false)
    if (error) {
      toast.error(t('contact.form.error'))
    } else {
      toast.success(t('contact.form.success'))
      setSubmitted(true)
    }
  }

  const handleWhatsApp = () => {
    const phone = (settings?.whatsapp_number || '').replace(/\D/g, '')
    if (!phone) { toast.error('WhatsApp number not configured. Please use email.'); return }
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(buildMessage())}`, '_blank')
  }

  const handleEmail = () => {
    const to = settings?.company_email || 'jeffharley461@gmail.com'
    const subject = `New Message from ${form.customer_name} | PeptideForge`
    const body = buildMessage().replace(/\*/g, '').replace(/🧬|👤|📋|⏰|🌐/gu, '').replace(/^\s+/gm, '')
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const whatsappNum = (settings?.whatsapp_number || '').replace(/\D/g, '')

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">{t('contact.title')}</h1>
        <p className="text-gray-500 dark:text-gray-400">{t('contact.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Info cards */}
        <div className="flex flex-col gap-6">
          {whatsappNum ? (
            <a href={`https://wa.me/${whatsappNum}`} target="_blank" rel="noopener noreferrer">
              <Card hover className="flex items-center gap-4 py-5">
                <WhatsAppLogo className="h-10 w-10 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{t('contact.whatsapp')}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{settings.whatsapp_number}</p>
                  <p className="text-xs text-green-500 mt-1">Available 24/7</p>
                </div>
              </Card>
            </a>
          ) : (
            <Card className="flex items-center gap-4 py-5 opacity-50">
              <WhatsAppLogo className="h-10 w-10 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{t('contact.whatsapp')}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Coming soon</p>
              </div>
            </Card>
          )}

          <a href={`mailto:${settings?.company_email || 'jeffharley461@gmail.com'}`}>
            <Card hover className="flex items-center gap-4 py-5">
              <GmailLogo className="h-10 w-10 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{t('contact.email')}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{settings?.company_email || 'jeffharley461@gmail.com'}</p>
                <p className="text-xs text-blue-500 mt-1">Available 24/7</p>
              </div>
            </Card>
          </a>
        </div>

        {/* Contact form */}
        <div className="lg:col-span-2">
          {submitted ? (
            <Card>
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Message received!</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Send us your message via WhatsApp or email — it's pre-filled with your details so we can reply faster.
                </p>

                <div className="space-y-3 max-w-sm mx-auto">
                  <button
                    onClick={handleWhatsApp}
                    className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-colors shadow-md shadow-green-500/20"
                  >
                    <WhatsAppLogo className="h-5 w-5 flex-shrink-0" />
                    Send via WhatsApp
                  </button>

                  <button
                    onClick={handleEmail}
                    className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors shadow-md shadow-blue-600/20"
                  >
                    <GmailLogo className="h-5 w-5 flex-shrink-0" />
                    Send via Email
                  </button>

                  <button
                    onClick={() => { setSubmitted(false); setForm({ customer_name: '', email: '', project_details: '' }) }}
                    className="w-full px-5 py-3 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>

                <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
                  Your message is saved. We'll respond within 24 hours.
                </p>
              </div>
            </Card>
          ) : (
          <Card>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">{t('contact.form.name')} *</label>
                  <input name="customer_name" value={form.customer_name} onChange={handleChange} required className="input" />
                </div>
                <div>
                  <label className="label">{t('contact.form.email')} *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required className="input" />
                </div>
              </div>
              <div>
                <label className="label">{t('contact.form.message')} *</label>
                <textarea name="project_details" value={form.project_details} onChange={handleChange} required rows={6} className="input resize-none" />
              </div>
              <Button type="submit" loading={loading} size="lg" className="w-full">
                {loading ? t('contact.form.sending') : t('contact.form.send')}
              </Button>
            </form>
          </Card>
          )}
        </div>
      </div>
    </div>
  )
}
