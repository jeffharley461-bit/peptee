import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../hooks/useAuth'
import Button from '../../components/ui/Button'
import { BeakerIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { t } = useTranslation()
  const { signIn, resetPassword } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [forgotMode, setForgotMode] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleLogin = async e => {
    e.preventDefault()
    setLoading(true)
    const { error } = await signIn(form.email, form.password)
    setLoading(false)
    if (error) {
      toast.error(t('admin.login.error'))
    } else {
      navigate('/admin/dashboard')
    }
  }

  const handleForgot = async e => {
    e.preventDefault()
    setLoading(true)
    const { error } = await resetPassword(form.email)
    setLoading(false)
    if (error) toast.error(error.message)
    else {
      toast.success('Password reset email sent!')
      setForgotMode(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
            <BeakerIcon className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white">PeptideForge</h1>
          <p className="text-gray-400 text-sm mt-1">
            {forgotMode ? 'Reset your password' : t('admin.login.subtitle')}
          </p>
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
          <form onSubmit={forgotMode ? handleForgot : handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">{t('admin.login.email')}</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="admin@peptideforge.com"
              />
            </div>

            {!forgotMode && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">{t('admin.login.password')}</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPw ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                  >
                    {showPw ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full" size="lg">
              {forgotMode
                ? (loading ? 'Sending...' : 'Send Reset Email')
                : (loading ? t('admin.login.signing') : t('admin.login.submit'))
              }
            </Button>
          </form>

          <button
            onClick={() => setForgotMode(m => !m)}
            className="mt-4 w-full text-center text-sm text-gray-400 hover:text-gray-200 transition-colors"
          >
            {forgotMode ? '← Back to login' : t('admin.login.forgot')}
          </button>
        </div>
      </div>
    </div>
  )
}
