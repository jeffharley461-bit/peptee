import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BeakerIcon } from '@heroicons/react/24/outline'
import { WhatsAppLogo, GmailLogo } from './icons/BrandIcons'
import NewsletterSignup from './NewsletterSignup'

export default function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <BeakerIcon className="h-6 w-6 text-primary" />
              <span className="text-white font-bold text-lg">PeptideForge</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Research-grade peptides supplied strictly for laboratory, analytical, and research purposes.
            </p>
            <NewsletterSignup />
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-semibold mb-3">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/catalog"              className="hover:text-white transition-colors">{t('nav.catalog')}</Link></li>
              <li><Link to="/reviews"              className="hover:text-white transition-colors">Reviews</Link></li>
              <li><Link to="/test-reports"         className="hover:text-white transition-colors">Test Reports / COA</Link></li>
              <li><Link to="/price-list"           className="hover:text-white transition-colors">Price List</Link></li>
              <li><Link to="/payment-instructions" className="hover:text-white transition-colors">Payment</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about"        className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/faq"          className="hover:text-white transition-colors">FAQs</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-white transition-colors">Shipping Policy</Link></li>
              <li><Link to="/terms"        className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy"      className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/disclaimer"   className="hover:text-white transition-colors">Disclaimer</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="mailto:jeffharley461@gmail.com"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <GmailLogo className="h-4 w-4 flex-shrink-0 text-red-400" />
                  <span>Email</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/19128086267"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <WhatsAppLogo className="h-4 w-4 flex-shrink-0 text-green-500" />
                  <span>WhatsApp</span>
                </a>
              </li>
            </ul>
            <p className="text-xs text-gray-500 mt-4">
              Responding within 24 hours · Mon–Fri
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-500">
          <p>© {year} PeptideForge. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/terms" className="hover:text-gray-300 transition-colors text-xs">Terms</Link>
            <Link to="/privacy" className="hover:text-gray-300 transition-colors text-xs">Privacy</Link>
            <Link to="/shipping-policy" className="hover:text-gray-300 transition-colors text-xs">Shipping</Link>
            <Link to="/admin/login" className="hover:text-gray-300 transition-colors text-xs">Admin</Link>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-gray-600 leading-relaxed max-w-3xl mx-auto">
          All products are intended strictly for laboratory, analytical, and research purposes only and are
          not intended for human or veterinary consumption or therapeutic application.
        </p>
      </div>
    </footer>
  )
}