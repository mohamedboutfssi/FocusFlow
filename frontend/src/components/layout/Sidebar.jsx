import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, CheckSquare, Zap, Timer, User,
  Settings, LogOut, Menu, X, ChevronRight, Moon, Sun
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tasks',     icon: CheckSquare,     label: 'Tasks' },
  { to: '/session',   icon: Zap,             label: 'Smart Session' },
  { to: '/timer',     icon: Timer,           label: 'Pomodoro' },
  { to: '/profile',   icon: User,            label: 'Profile' },
  { to: '/settings',  icon: Settings,        label: 'Settings' },
]

function NavItem({ to, icon: Icon, label, collapsed, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative
        ${isActive
          ? 'bg-brand-500/15 text-brand-400 border border-brand-500/20'
          : 'dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/6 text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-transparent'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div
              layoutId="nav-active"
              className="absolute inset-0 bg-brand-500/10 rounded-xl"
            />
          )}
          <Icon size={18} className="relative shrink-0" />
          {!collapsed && <span className="relative text-sm font-medium">{label}</span>}
          {collapsed && (
            <div className="absolute left-full ml-3 px-2 py-1 rounded-lg dark:bg-surface-800 bg-white dark:text-white text-slate-800 text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg border dark:border-white/10 border-slate-200 z-50">
              {label}
            </div>
          )}
        </>
      )}
    </NavLink>
  )
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 dark:bg-surface-950/90 bg-white/90 backdrop-blur-md border-b dark:border-white/6 border-slate-200 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full border-2 border-white" />
          </div>
          <span className="font-display font-bold text-sm dark:text-white text-slate-800">FocusFlow</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="w-8 h-8 rounded-lg dark:bg-white/6 bg-slate-100 flex items-center justify-center dark:text-slate-300 text-slate-600"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-64 dark:bg-surface-950 bg-white border-r dark:border-white/6 border-slate-200 flex flex-col"
          >
            <SidebarContent
              user={user} collapsed={false} isDark={isDark}
              toggleTheme={toggleTheme} handleLogout={handleLogout}
              onNavClick={() => setMobileOpen(false)}
              onClose={() => setMobileOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-30 dark:bg-surface-950 bg-white border-r dark:border-white/6 border-slate-200 overflow-hidden"
      >
        <SidebarContent
          user={user} collapsed={collapsed} isDark={isDark}
          toggleTheme={toggleTheme} handleLogout={handleLogout}
          onCollapseToggle={() => setCollapsed(c => !c)}
        />
      </motion.aside>
    </>
  )
}

function SidebarContent({ user, collapsed, isDark, toggleTheme, handleLogout, onNavClick, onCollapseToggle, onClose }) {
  return (
    <>
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b dark:border-white/6 border-slate-100 shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center shadow-glow-green">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-white" />
            </div>
            <span className="font-display font-bold dark:text-white text-slate-800">FocusFlow</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center mx-auto">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-white" />
          </div>
        )}
        {onClose && (
          <button onClick={onClose} className="w-7 h-7 rounded-lg dark:hover:bg-white/8 hover:bg-slate-100 flex items-center justify-center dark:text-slate-400 text-slate-500">
            <X size={16} />
          </button>
        )}
        {onCollapseToggle && (
          <button
            onClick={onCollapseToggle}
            className="w-7 h-7 rounded-lg dark:hover:bg-white/8 hover:bg-slate-100 flex items-center justify-center dark:text-slate-400 text-slate-500 transition-colors"
          >
            <motion.div animate={{ rotate: collapsed ? 0 : 180 }}>
              <ChevronRight size={16} />
            </motion.div>
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV.map(item => (
          <NavItem key={item.to} {...item} collapsed={collapsed} onClick={onNavClick} />
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 space-y-1 border-t dark:border-white/6 border-slate-100">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/6 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
          {!collapsed && <span className="text-sm font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        {user && !collapsed && (
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl dark:bg-white/4 bg-slate-50 border dark:border-white/6 border-slate-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium dark:text-white text-slate-800 truncate">{user.name}</div>
              <div className="text-xs dark:text-slate-500 text-slate-400 truncate">{user.email}</div>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-400 hover:bg-rose-400/10 transition-all"
        >
          <LogOut size={18} />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </>
  )
}
