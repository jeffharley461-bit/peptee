import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BeakerIcon } from '@heroicons/react/24/outline'
import { WhatsAppLogo, GmailLogo } from './icons/BrandIcons'

export default function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <BeakerIcon className="h-6 w-6 text-primary" />
              <span className="text-white font-bold text-lg">PeptideForge</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Custom peptide synthesis & R&D consulting for the future.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-3">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/catalog"              className="hover:text-white transition-colors">{t('nav.catalog')}</Link></li>
              <li><Link to="/how-it-works"          className="hover:text-white transition-colors">{t('nav.howItWorks')}</Link></li>
              <li><Link to="/contact"              className="hover:text-white transition-colors">{t('nav.contact')}</Link></li>
              <li><Link to="/payment-instructions" className="hover:text-white transition-colors">Payment</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about"      className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/faq"        className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <GmailLogo className="h-4 w-4 flex-shrink-0" />
                <a href="mailto:jeffharley461@gmail.com" className="hover:text-white transition-colors">
                  jeffharley461@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <WhatsAppLogo className="h-4 w-4 flex-shrink-0" />
                <span className="text-gray-400">WhatsApp (coming soon)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-500">
          <p>© {year} PeptideForge. All rights reserved.</p>
          <Link to="/admin/login" className="hover:text-gray-300 transition-colors text-xs">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
