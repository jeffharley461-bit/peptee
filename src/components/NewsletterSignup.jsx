import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import { EnvelopeIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'

export default function NewsletterSignup({ variant = 'dark' }) {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error('Please enter a valid email address')
      return
    }
    setLoading(true)
    const { error } = await supabase.from('newsletter_subscribers').insert({ email: trimmed })
    setLoading(false)
    if (error && error.code !== '23505') {
      toast.error(error.message)
      return
    }
    setEmail('')
    toast.success(t('footer.newsletter.success'))
  }

  const dark = variant === 'dark'

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`flex flex-col sm:flex-row gap-2`}>
        <div className="relative flex-1">
          <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={t('footer.newsletter.placeholder')}
            className={`w-full pl-10 pr-3 py-3 rounded-lg border text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
              dark
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 bg-primary text-white px-5 py-3 rounded-lg font-semibold hover:bg-primary-600 disabled:opacity-60 transition-colors whitespace-nowrap"
        >
          {loading
            ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            : <PaperAirplaneIcon className="h-4 w-4" />}
          {t('footer.newsletter.subscribe')}
        </button>
      </div>
    </form>
  )
}
