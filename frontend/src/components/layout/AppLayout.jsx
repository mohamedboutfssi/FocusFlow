import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { Toaster } from 'react-hot-toast'

export default function AppLayout() {
  return (
    <div className="min-h-screen dark:bg-surface-950 bg-slate-50 dark:bg-grid-dark bg-grid-light bg-grid">
      <Sidebar />
      <main className="lg:pl-60 pt-14 lg:pt-0 transition-all duration-300">
        <div className="min-h-screen p-4 md:p-6 lg:p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#0f172a' } },
        }}
      />
    </div>
  )
}
