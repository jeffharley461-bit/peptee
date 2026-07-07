import { useState } from 'react'
import { Outlet, NavLink, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import ThemeToggle from '../components/ThemeToggle'
import Sidebar from '../components/admin/Sidebar'
import {
  HomeIcon, CubeIcon, InboxIcon, ChartBarIcon,
  ArrowDownTrayIcon, Cog6ToothIcon, ArrowLeftOnRectangleIcon,
  BeakerIcon, Bars3Icon, XMarkIcon
} from '@heroicons/react/24/outline'

import { TagIcon } from '@heroicons/react/24/outline'
import { CurrencyDollarIcon } from '@heroicons/react/24/outline'

const navItems = [
  { to: '/admin/dashboard',   icon: HomeIcon,             key: 'dashboard' },
  { to: '/admin/products',    icon: CubeIcon,             key: 'products' },
  { to: '/admin/categories',  icon: TagIcon,              label: 'Categories' },
  { to: '/admin/price-list',  icon: CurrencyDollarIcon,   label: 'Price List' },
  { to: '/admin/inquiries',   icon: InboxIcon,            key: 'inquiries' },
  { to: '/admin/analytics',   icon: ChartBarIcon,      key: 'analytics' },
  { to: '/admin/export',      icon: ArrowDownTrayIcon, key: 'export' },
  { to: '/admin/settings',    icon: Cog6ToothIcon,     key: 'settings' },
]

export default function AdminLayout() {
  const { t } = useTranslation()
  const { session, signOut } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform md:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-800">
          <Link to="/" className="flex items-center gap-2">
            <BeakerIcon className="h-6 w-6 text-primary" />
            <span className="text-white font-bold">PeptideForge</span>
          </Link>
          <button onClick={() => setMobileOpen(false)} className="text-gray-400 hover:text-white">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <nav className="py-4 space-y-1 px-2">
          {navItems.map(({ to, icon: Icon, key, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-primary text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {label || t(`admin.nav.${key}`)}
            </NavLink>
          ))}
          <button
            onClick={() => { signOut(); setMobileOpen(false) }}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            {t('admin.nav.logout')}
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 sm:px-6">
          <button
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setMobileOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="flex-1 md:hidden" />
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
              {session?.user?.email}
            </span>
            <ThemeToggle />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
