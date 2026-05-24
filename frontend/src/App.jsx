import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { TaskProvider } from './context/TaskContext'
import { ThemeProvider } from './context/ThemeContext'
import { SessionProvider } from './context/SessionContext'
import ProtectedRoute from './components/layout/ProtectedRoute'
import AppLayout from './components/layout/AppLayout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import TasksPage from './pages/TasksPage'
import SessionPage from './pages/SessionPage'
import TimerPage from './pages/TimerPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TaskProvider>
          <SessionProvider>
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/login"    element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected routes */}
                <Route element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/tasks"     element={<TasksPage />} />
                  <Route path="/session"   element={<SessionPage />} />
                  <Route path="/timer"     element={<TimerPage />} />
                  <Route path="/profile"   element={<ProfilePage />} />
                  <Route path="/settings"  element={<SettingsPage />} />
                </Route>

                {/* Redirect */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </BrowserRouter>
          </SessionProvider>
        </TaskProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
