import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'

const HomePage                = lazy(() => import('./pages/HomePage'))
const CatalogPage             = lazy(() => import('./pages/CatalogPage'))
const PeptideDetailPage       = lazy(() => import('./pages/PeptideDetailPage'))
const ContactPage             = lazy(() => import('./pages/ContactPage'))
const HowItWorksPage          = lazy(() => import('./pages/HowItWorksPage'))
const PaymentInstructionsPage = lazy(() => import('./pages/PaymentInstructionsPage'))

const LoginPage      = lazy(() => import('./pages/admin/LoginPage'))
const DashboardPage  = lazy(() => import('./pages/admin/DashboardPage'))
const ProductsPage   = lazy(() => import('./pages/admin/ProductsPage'))
const CategoriesPage = lazy(() => import('./pages/admin/CategoriesPage'))
const InquiriesPage  = lazy(() => import('./pages/admin/InquiriesPage'))
const AnalyticsPage  = lazy(() => import('./pages/admin/AnalyticsPage'))
const ExportPage     = lazy(() => import('./pages/admin/ExportPage'))
const SettingsPage   = lazy(() => import('./pages/admin/SettingsPage'))

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'dark:bg-gray-800 dark:text-white',
          duration: 4000,
        }}
      />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/"                      element={<HomePage />} />
            <Route path="/catalog"               element={<CatalogPage />} />
            <Route path="/peptide/:id"           element={<PeptideDetailPage />} />
            <Route path="/contact"              element={<ContactPage />} />
            <Route path="/how-it-works"         element={<HowItWorksPage />} />
            <Route path="/payment-instructions" element={<PaymentInstructionsPage />} />
          </Route>

          <Route path="/admin/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin"           element={<DashboardPage />} />
              <Route path="/admin/dashboard" element={<DashboardPage />} />
              <Route path="/admin/products"    element={<ProductsPage />} />
              <Route path="/admin/categories" element={<CategoriesPage />} />
              <Route path="/admin/inquiries"  element={<InquiriesPage />} />
              <Route path="/admin/analytics" element={<AnalyticsPage />} />
              <Route path="/admin/export"    element={<ExportPage />} />
              <Route path="/admin/settings"  element={<SettingsPage />} />
            </Route>
          </Route>

          <Route path="*" element={
            <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-950">
              <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
              <p className="text-gray-500 dark:text-gray-400 mb-8">Page not found</p>
              <a href="/" className="btn-primary inline-block">Go Home</a>
            </div>
          } />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
