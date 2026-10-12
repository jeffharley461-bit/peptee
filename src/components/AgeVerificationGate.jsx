import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ShieldCheckIcon, BeakerIcon, ExclamationTriangleIcon, ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline'

const STORAGE_KEY = 'age_verified'

export default function AgeVerificationGate({ children }) {
  const [verified, setVerified] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) === 'true' } catch { return false }
  })
  const [blocked, setBlocked] = useState(false)

  const confirm = () => {
    try { localStorage.setItem(STORAGE_KEY, 'true') } catch { /* ignore */ }
    setVerified(true)
  }

  if (verified) return children

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
      >
        <div className="h-1.5 bg-gradient-to-r from-primary to-accent" />

        <div className="p-8">
          {blocked ? (
            <div className="text-center">
              <div className="inline-flex p-3 rounded-full bg-red-50 dark:bg-red-900/20 mb-4">
                <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Access Restricted
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
                You must be at least 18 years old to access this website. We are unable to
                grant you entry at this time.
              </p>
              <a
                href="https://www.google.com"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                Leave this site
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              </a>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
                  <ShieldCheckIcon className="h-8 w-8 text-primary" />
                </div>
                <span className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-2">
                  <BeakerIcon className="h-4 w-4" />
                  Research Use Only
                </span>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Confirm Your Age
                </h2>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed text-center mb-8">
                This website provides information about products supplied strictly for
                laboratory, analytical, and research purposes. By entering, you confirm
                that you are at least 18 years old and that you understand these products
                are not intended for human consumption or therapeutic application.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={confirm}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors"
                >
                  <ShieldCheckIcon className="h-5 w-5" />
                  Yes, I am 18 or older
                </button>
                <button
                  onClick={() => setBlocked(true)}
                  className="flex-1 inline-flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  No, I am under 18
                </button>
              </div>

              <p className="text-xs text-gray-400 text-center mt-6">
                Products are not for human or veterinary use. For laboratory research only.
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
