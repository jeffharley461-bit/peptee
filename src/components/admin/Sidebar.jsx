import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../hooks/useAuth'
import {
  HomeIcon, CubeIcon, TagIcon, InboxIcon, ChartBarIcon,
  ArrowDownTrayIcon, Cog6ToothIcon, ArrowLeftOnRectangleIcon,
  BeakerIcon, Bars3Icon, XMarkIcon, CurrencyDollarIcon
} from '@heroicons/react/24/outline'

const navItems = [
  { to: '/admin/dashboard',   icon: HomeIcon,             label: 'Dashboard' },
  { to: '/admin/products',    icon: CubeIcon,             label: 'Products' },
  { to: '/admin/categories',  icon: TagIcon,              label: 'Categories' },
  { to: '/admin/price-list',  icon: CurrencyDollarIcon,   label: 'Price List' },
  { to: '/admin/inquiries',   icon: InboxIcon,            label: 'Inquiries' },
  { to: '/admin/analytics',   icon: ChartBarIcon,      label: 'Analytics' },
  { to: '/admin/export',      icon: ArrowDownTrayIcon, label: 'Export' },
  { to: '/admin/settings',    icon: Cog6ToothIcon,     label: 'Settings' },
]

export default function Sidebar() {
  const { t } = useTranslation()
  const { signOut } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`hidden md:flex flex-col ${collapsed ? 'w-16' : 'w-56'} transition-all duration-200 bg-gray-900 dark:bg-gray-950 border-r border-gray-800 min-h-screen`}>
        {/* Logo area */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-800">
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2">
              <BeakerIcon className="h-6 w-6 text-primary" />
              <span className="text-white font-bold text-sm">PeptideForge</span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(c => !c)}
            className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`
              }
              title={collapsed ? label : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Sign out */}
        <div className="px-2 pb-4">
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            title={collapsed ? t('admin.nav.logout') : undefined}
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>{t('admin.nav.logout')}</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
