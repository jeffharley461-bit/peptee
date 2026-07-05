import { useTheme } from '../hooks/useTheme'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'

export default function ThemeToggle({ className = '' }) {
  const { dark, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      className={`p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${className}`}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {dark ? (
        <SunIcon className="h-5 w-5" />
      ) : (
        <MoonIcon className="h-5 w-5" />
      )}
    </button>
  )
}
