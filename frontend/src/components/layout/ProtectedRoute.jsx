import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen dark:bg-surface-950 bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center animate-pulse">
            <div className="w-5 h-5 rounded-full border-2 border-white" />
          </div>
          <p className="text-sm dark:text-slate-400 text-slate-500">Loading FocusFlow...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
