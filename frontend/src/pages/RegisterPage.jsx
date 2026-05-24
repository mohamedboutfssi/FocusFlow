import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'At least 6 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    const res = register({ name: form.name, email: form.email, password: form.password })
    setLoading(false)
    if (res.success) navigate('/dashboard')
    else setErrors({ general: res.error })
  }

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  return (
    <div className="min-h-screen dark:bg-surface-950 bg-slate-50 dark:bg-grid-dark bg-grid-light bg-grid flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full border-2 border-white" />
          </div>
          <span className="font-display font-bold text-xl dark:text-white text-slate-800">FocusFlow</span>
        </div>

        <h1 className="text-3xl font-display font-bold dark:text-white text-slate-800 mb-1">Create account</h1>
        <p className="dark:text-slate-400 text-slate-500 mb-8">Start your smart study journey today.</p>

        {errors.general && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name" placeholder="Alex Martin" value={form.name} onChange={set('name')} error={errors.name} icon={<User size={16} />} />
          <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} error={errors.email} icon={<Mail size={16} />} />
          <div className="relative">
            <Input label="Password" type={showPwd ? 'text' : 'password'} placeholder="Min. 6 characters" value={form.password} onChange={set('password')} error={errors.password} icon={<Lock size={16} />} />
            <button type="button" onClick={() => setShowPwd(s => !s)} className="absolute right-3 top-[34px] dark:text-slate-400 text-slate-500">
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <Input label="Confirm Password" type={showPwd ? 'text' : 'password'} placeholder="Repeat password" value={form.confirm} onChange={set('confirm')} error={errors.confirm} icon={<Lock size={16} />} />

          <Button type="submit" size="lg" className="w-full justify-center mt-2" loading={loading}>
            Create Account
          </Button>
        </form>

        <p className="text-center mt-6 text-sm dark:text-slate-400 text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">Sign in</Link>
        </p>
      </motion.div>
    </div>
  )
}
