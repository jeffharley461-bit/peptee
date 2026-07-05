import { useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LanguageContext } from '../store/LanguageContext'
import { CheckIcon } from '@heroicons/react/24/outline'

export default function LanguagePickerModal() {
  const { showPicker, languages, changeLanguage, setShowPicker, currentLanguage } = useContext(LanguageContext)

  return (
    <AnimatePresence>
      {showPicker && (
        <>
          {/* Invisible full-screen backdrop — closes modal on any outside click */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[99] bg-black/30 backdrop-blur-[2px]"
            onClick={() => setShowPicker(false)}
          />

          {/* Panel — positioned top-right below the navbar */}
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-20 right-4 z-[100] w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Select Language
              </p>
            </div>

            {/* Language list */}
            <div className="py-1">
              {languages.map(lang => {
                const isActive = currentLanguage?.startsWith(lang.code)
                return (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left ${
                      isActive
                        ? 'bg-primary/5 text-primary'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="text-lg leading-none">{lang.flag}</span>
                    <span className="text-sm font-medium flex-1">{lang.name}</span>
                    {isActive && <CheckIcon className="h-4 w-4 text-primary flex-shrink-0" />}
                  </button>
                )
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
