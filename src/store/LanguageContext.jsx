import { createContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

export const LanguageContext = createContext(null)

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
]

export function LanguageProvider({ children }) {
  const { i18n } = useTranslation()
  const [showPicker, setShowPicker] = useState(() => {
    return !localStorage.getItem('peptideforge_lang')
  })

  const changeLanguage = (code) => {
    i18n.changeLanguage(code)
    localStorage.setItem('peptideforge_lang', code)
    setShowPicker(false)
  }

  return (
    <LanguageContext.Provider value={{
      currentLanguage: i18n.language,
      languages: SUPPORTED_LANGUAGES,
      changeLanguage,
      showPicker,
      setShowPicker,
    }}>
      {children}
    </LanguageContext.Provider>
  )
}
