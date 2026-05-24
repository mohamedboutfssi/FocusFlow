import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { getRandomQuote } from '../data/quotes'

const quote = getRandomQuote()

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.password) e.password = 'Password is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    const res = login(form)
    setLoading(false)
    if (res.success) navigate('/dashboard')
    else setErrors({ general: res.error })
  }

  const fillDemo = () => {
    setForm({ email: 'demo@focusflow.io', password: 'demo123' })
    setErrors({})
  }

  return (
    <div className="min-h-screen dark:bg-surface-950 bg-slate-50 dark:bg-grid-dark bg-grid-light bg-grid flex">
      {/* Left illustration */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-cyan-500/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center shadow-glow-green">
            <div className="w-4 h-4 rounded-full border-2 border-white" />
          </div>
          <span className="font-display font-bold text-xl dark:text-white text-slate-800">FocusFlow</span>
        </div>

        <div className="relative space-y-8">
          {/* Floating cards */}
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="dark:bg-white/6 bg-white rounded-2xl p-5 border dark:border-white/8 border-slate-200 shadow-card max-w-xs">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-brand-500/15 rounded-xl flex items-center justify-center text-brand-400 text-lg">🔥</div>
              <div>
                <div className="text-xs dark:text-slate-400 text-slate-500">Active Session</div>
                <div className="text-sm font-semibold dark:text-white text-slate-800">High Energy Mode</div>
              </div>
            </div>
            <div className="flex gap-2">
              {['Math Exam', 'Essay', 'Research'].map(t => (
                <span key={t} className="text-xs px-2 py-1 rounded-lg bg-brand-500/10 text-brand-400">{t}</span>
              ))}
            </div>
          </motion.div>

          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="dark:bg-white/6 bg-white rounded-2xl p-5 border dark:border-white/8 border-slate-200 shadow-card max-w-xs ml-12">
            <div className="text-2xl font-display font-bold dark:text-white text-slate-800 mb-1">87%</div>
            <div className="text-xs dark:text-slate-400 text-slate-500 mb-3">Productivity this week</div>
            <div className="flex gap-1">
              {[40, 65, 80, 55, 90, 70, 87].map((h, i) => (
                <div key={i} className="flex-1 bg-brand-500/20 rounded-sm relative overflow-hidden" style={{ height: 32 }}>
                  <div className="absolute bottom-0 left-0 right-0 bg-brand-500 rounded-sm transition-all" style={{ height: `${h}%` }} />
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="relative">
          <p className="text-lg font-display font-medium dark:text-white text-slate-700 mb-2">"{quote.text}"</p>
          <p className="text-sm dark:text-slate-500 text-slate-400">— {quote.author}</p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full border-2 border-white" />
            </div>
            <span className="font-display font-bold text-xl dark:text-white text-slate-800">FocusFlow</span>
          </div>

          <h1 className="text-3xl font-display font-bold dark:text-white text-slate-800 mb-1">Welcome back</h1>
          <p className="dark:text-slate-400 text-slate-500 mb-8">Sign in to continue your focus journey.</p>

          {errors.general && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
              {errors.general}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              error={errors.email}
              icon={<Mail size={16} />}
            />
            <div className="relative">
              <Input
                label="Password"
                type={showPwd ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                error={errors.password}
                icon={<Lock size={16} />}
              />
              <button
                type="button"
                onClick={() => setShowPwd(s => !s)}
                className="absolute right-3 top-[34px] dark:text-slate-400 text-slate-500 hover:text-slate-300"
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <Button type="submit" size="lg" className="w-full justify-center" loading={loading}>
              Sign In
            </Button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px dark:bg-white/8 bg-slate-200" />
            <span className="text-xs dark:text-slate-500 text-slate-400">or</span>
            <div className="flex-1 h-px dark:bg-white/8 bg-slate-200" />
          </div>

          <Button variant="secondary" size="lg" className="w-full justify-center" onClick={fillDemo}>
            Try Demo Account
          </Button>

          <p className="text-center mt-6 text-sm dark:text-slate-400 text-slate-500">
            No account?{' '}
            <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Create one free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
