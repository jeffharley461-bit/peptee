import { createContext, useEffect, useState } from 'react'

export const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem('peptideforge_theme')
    if (stored) return stored === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('peptideforge_theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <ThemeContext.Provider value={{ dark, toggle: () => setDark(d => !d) }}>
      {children}
    </ThemeContext.Provider>
  )
}
