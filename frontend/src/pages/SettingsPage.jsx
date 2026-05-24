import { useState } from 'react'
import { motion } from 'framer-motion'
import { Moon, Sun, Trash2, Download, Upload, Bell } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

function SettingRow({ icon, title, description, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b dark:border-white/6 border-slate-100 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl dark:bg-white/6 bg-slate-100 flex items-center justify-center dark:text-slate-300 text-slate-600">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium dark:text-white text-slate-800">{title}</p>
          <p className="text-xs dark:text-slate-500 text-slate-400">{description}</p>
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors ${value ? 'bg-brand-500' : 'dark:bg-white/15 bg-slate-300'}`}
    >
      <motion.div
        animate={{ x: value ? 20 : 2 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
      />
    </button>
  )
}

export default function SettingsPage() {
  const { isDark, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState(true)
  const [sounds, setSounds] = useState(true)
  const [autoBreak, setAutoBreak] = useState(false)

  const exportData = () => {
    const data = {
      user,
      tasks: JSON.parse(localStorage.getItem(`ff_tasks_${user.id}`) || '[]'),
      sessions: JSON.parse(localStorage.getItem(`ff_sessions_${user.id}`) || '[]'),
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `focusflow-backup-${Date.now()}.json`; a.click()
    URL.revokeObjectURL(url)
    toast.success('Data exported!')
  }

  const clearData = () => {
    if (!confirm('Delete ALL your data? This cannot be undone.')) return
    localStorage.removeItem(`ff_tasks_${user.id}`)
    localStorage.removeItem(`ff_sessions_${user.id}`)
    toast('Data cleared', { icon: '🗑️' })
  }

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="space-y-6 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold dark:text-white text-slate-800">Settings</h1>
        <p className="text-sm dark:text-slate-400 text-slate-500 mt-1">Customize your FocusFlow experience</p>
      </motion.div>

      {/* Appearance */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="rounded-2xl p-5 dark:bg-white/4 bg-white border dark:border-white/8 border-slate-200">
        <h2 className="text-xs font-semibold uppercase tracking-wider dark:text-slate-500 text-slate-400 mb-2">Appearance</h2>
        <SettingRow icon={isDark ? <Moon size={16} /> : <Sun size={16} />} title="Dark Mode" description="Toggle between dark and light theme">
          <Toggle value={isDark} onChange={toggleTheme} />
        </SettingRow>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl p-5 dark:bg-white/4 bg-white border dark:border-white/8 border-slate-200">
        <h2 className="text-xs font-semibold uppercase tracking-wider dark:text-slate-500 text-slate-400 mb-2">Notifications</h2>
        <SettingRow icon={<Bell size={16} />} title="Timer Notifications" description="Show alerts when sessions end">
          <Toggle value={notifications} onChange={setNotifications} />
        </SettingRow>
        <SettingRow icon={<span className="text-sm">🔊</span>} title="Sound Effects" description="Play sound when timer finishes">
          <Toggle value={sounds} onChange={setSounds} />
        </SettingRow>
        <SettingRow icon={<span className="text-sm">⏭️</span>} title="Auto-advance Breaks" description="Automatically start breaks after focus">
          <Toggle value={autoBreak} onChange={setAutoBreak} />
        </SettingRow>
      </motion.div>

      {/* Data */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="rounded-2xl p-5 dark:bg-white/4 bg-white border dark:border-white/8 border-slate-200">
        <h2 className="text-xs font-semibold uppercase tracking-wider dark:text-slate-500 text-slate-400 mb-2">Data</h2>
        <SettingRow icon={<Download size={16} />} title="Export Data" description="Download all your tasks and sessions as JSON">
          <Button variant="secondary" size="sm" onClick={exportData} icon={<Download size={14} />}>Export</Button>
        </SettingRow>
        <SettingRow icon={<Trash2 size={16} />} title="Clear All Data" description="Permanently delete all tasks and sessions">
          <Button variant="danger" size="sm" onClick={clearData} icon={<Trash2 size={14} />}>Clear</Button>
        </SettingRow>
      </motion.div>

      {/* Account */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-2xl p-5 dark:bg-white/4 bg-white border dark:border-white/8 border-slate-200">
        <h2 className="text-xs font-semibold uppercase tracking-wider dark:text-slate-500 text-slate-400 mb-2">Account</h2>
        <div className="py-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium dark:text-white text-slate-800">{user?.name}</p>
            <p className="text-xs dark:text-slate-500 text-slate-400">{user?.email}</p>
          </div>
          <Button variant="danger" size="sm" onClick={handleLogout}>Sign Out</Button>
        </div>
      </motion.div>

      {/* Footer */}
      <p className="text-center text-xs dark:text-slate-600 text-slate-400 pb-4">
        FocusFlow v1.0 — Built with React + Vite + TailwindCSS
      </p>
    </div>
  )
}
