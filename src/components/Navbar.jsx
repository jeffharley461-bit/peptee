import { useState, useContext } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Bars3Icon, XMarkIcon, BeakerIcon, ChevronDownIcon, ShoppingCartIcon, CheckIcon } from '@heroicons/react/24/outline'
import ThemeToggle from './ThemeToggle'
import { LanguageContext } from '../store/LanguageContext'
import { useCart } from '../store/CartContext'
import CartDrawer from './CartDrawer'
import CheckoutModal from './CheckoutModal'

export default function Navbar() {
  const { t } = useTranslation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const { currentLanguage, languages, changeLanguage } = useContext(LanguageContext)
  const { count } = useCart()

  const navLinks = [
    { to: '/catalog',       label: t('nav.catalog') },
    { to: '/how-it-works',  label: t('nav.howItWorks') },
    { to: '/about',         label: 'About' },
    { to: '/contact',       label: t('nav.contact') },
  ]

  const currentLang = languages.find(l => l.code === currentLanguage?.split('-')[0]) || languages[0]

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-white">
            <BeakerIcon className="h-7 w-7 text-primary" />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              PeptideForge
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Language switcher */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setLangOpen(o => !o)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <span>{currentLang?.flag}</span>
                <span className="hidden lg:block font-medium">{currentLang?.code?.toUpperCase()}</span>
                <motion.span animate={{ rotate: langOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                  <ChevronDownIcon className="h-3.5 w-3.5" />
                </motion.span>
              </button>

              {/* Invisible backdrop to close on outside click */}
              {langOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
              )}

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 mt-1 w-52 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 py-1 z-50 overflow-hidden"
                  >
                    <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800">
                      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Language</p>
                    </div>
                    {languages.map(lang => {
                      const isActive = currentLanguage?.startsWith(lang.code)
                      return (
                        <button
                          key={lang.code}
                          onClick={() => { changeLanguage(lang.code); setLangOpen(false) }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors ${
                            isActive
                              ? 'bg-primary/5 text-primary font-medium'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          <span className="text-base">{lang.flag}</span>
                          <span className="flex-1">{lang.name}</span>
                          {isActive && <CheckIcon className="h-3.5 w-3.5 text-primary flex-shrink-0" />}
                        </button>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <ThemeToggle />

            {/* Cart button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCartIcon className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </button>

            <Link
              to="/catalog"
              className="hidden md:inline-flex btn-primary text-sm py-2 px-4"
            >
              {t('catalog.title')}
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setMobileOpen(o => !o)}
            >
              {mobileOpen
                ? <XMarkIcon className="h-6 w-6" />
                : <Bars3Icon className="h-6 w-6" />
              }
            </button>
          </div>
        </div>
      </div>

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => { setCartOpen(false); setCheckoutOpen(true) }}
      />
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {/* Language buttons in mobile */}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <p className="px-3 py-1 text-xs text-gray-400 uppercase tracking-wider">{t('common.language')}</p>
              <div className="grid grid-cols-3 gap-1 mt-1">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => { changeLanguage(lang.code); setMobileOpen(false) }}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                      currentLanguage?.startsWith(lang.code)
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.code.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
