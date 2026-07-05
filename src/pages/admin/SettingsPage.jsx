import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSettings } from '../../hooks/useSettings'
import { supabase } from '../../lib/supabase'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import ImageUploader from '../../components/admin/ImageUploader'
import { WhatsAppLogo, GmailLogo } from '../../components/icons/BrandIcons'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { t } = useTranslation()
  const { settings, loading, saveSettings } = useSettings()
  const [form, setForm] = useState({
    company_name: '', company_email: '', company_phone: '',
    whatsapp_number: '', currency: 'USD', date_format: 'MM/DD/YYYY', logo_url: '',
  })
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' })
  const [saving, setSaving]   = useState(false)
  const [pwSaving, setPwSaving] = useState(false)

  useEffect(() => {
    if (settings) setForm({ ...form, ...settings })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings])

  const handleChange  = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  const handlePwChange = e => setPwForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true)
    const { error } = await saveSettings(form)
    setSaving(false)
    if (error) toast.error(error.message || error)
    else toast.success(t('admin.settings.saveSuccess'))
  }

  const handlePasswordChange = async e => {
    e.preventDefault()
    if (pwForm.next !== pwForm.confirm) return toast.error('Passwords do not match')
    setPwSaving(true)
    const { error } = await supabase.auth.updateUser({ password: pwForm.next })
    setPwSaving(false)
    if (error) toast.error(error.message)
    else { toast.success('Password updated!'); setPwForm({ current: '', next: '', confirm: '' }) }
  }

  if (loading) return <div className="animate-pulse h-96 bg-gray-100 dark:bg-gray-800 rounded-xl" />

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">{t('admin.settings.title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Info */}
        <Card>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-5">{t('admin.settings.companyInfo')}</h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="label">{t('admin.settings.companyName')}</label>
              <input name="company_name" value={form.company_name} onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="label flex items-center gap-2">
                <GmailLogo className="h-4 w-4" />
                {t('admin.settings.companyEmail')}
                <span className="text-xs text-gray-400 font-normal ml-1">— used in inquiry &amp; checkout emails</span>
              </label>
              <input name="company_email" type="email" value={form.company_email} onChange={handleChange} className="input" placeholder="jeffharley461@gmail.com" />
            </div>
            <div>
              <label className="label flex items-center gap-2">
                <WhatsAppLogo className="h-4 w-4" />
                {t('admin.settings.whatsapp')}
                <span className="text-xs text-gray-400 font-normal ml-1">— used in inquiry &amp; checkout WhatsApp links</span>
              </label>
              <input name="whatsapp_number" value={form.whatsapp_number} onChange={handleChange} className="input" placeholder="+1 234 567 8900 (include country code)" />
            </div>
            <div>
              <label className="label">{t('admin.settings.companyPhone')}</label>
              <input name="company_phone" value={form.company_phone} onChange={handleChange} className="input" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">{t('admin.settings.currency')}</label>
                <select name="currency" value={form.currency} onChange={handleChange} className="input">
                  <option>USD</option><option>EUR</option><option>GBP</option><option>CNY</option>
                </select>
              </div>
              <div>
                <label className="label">{t('admin.settings.dateFormat')}</label>
                <select name="date_format" value={form.date_format} onChange={handleChange} className="input">
                  <option>MM/DD/YYYY</option><option>DD/MM/YYYY</option><option>YYYY-MM-DD</option>
                </select>
              </div>
            </div>
            <Button type="submit" loading={saving} className="w-full">
              {saving ? t('admin.settings.saving') : t('admin.settings.save')}
            </Button>
          </form>
        </Card>

        <div className="space-y-6">
          {/* Logo upload */}
          <Card>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-5">{t('admin.settings.logo')}</h3>
            <ImageUploader
              value={form.logo_url}
              onChange={url => setForm(f => ({ ...f, logo_url: url || '' }))}
              bucket="company-logos"
            />
            {form.logo_url && (
              <Button onClick={() => saveSettings({ logo_url: form.logo_url })} className="w-full mt-3" size="sm">
                Save Logo
              </Button>
            )}
          </Card>

          {/* Password change */}
          <Card>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-5">{t('admin.settings.changePassword')}</h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="label">{t('admin.settings.newPassword')}</label>
                <input name="next" type="password" value={pwForm.next} onChange={handlePwChange} required minLength={6} className="input" />
              </div>
              <div>
                <label className="label">{t('admin.settings.confirmPassword')}</label>
                <input name="confirm" type="password" value={pwForm.confirm} onChange={handlePwChange} required className="input" />
              </div>
              <Button type="submit" loading={pwSaving} variant="secondary" className="w-full">
                Update Password
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
