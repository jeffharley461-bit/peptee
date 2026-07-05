import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './lib/i18n'
import './index.css'
import { ThemeProvider }    from './store/ThemeContext'
import { AuthProvider }     from './store/AuthContext'
import { LanguageProvider } from './store/LanguageContext'
import { CartProvider }     from './store/CartContext'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
)
