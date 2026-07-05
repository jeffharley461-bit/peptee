import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) return <Navigate to="/admin/login" replace />

  return <Outlet />
}
