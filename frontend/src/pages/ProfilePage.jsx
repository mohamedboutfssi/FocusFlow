import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Target, Calendar } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTasks } from '../context/TaskContext'
import { useSession } from '../context/SessionContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { formatDate } from '../utils/helpers'

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const { stats } = useTasks()
  const { sessionStats } = useSession()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: user?.name || '', focusGoal: user?.focusGoal || 120 })
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    updateProfile(form)
    setEditing(false)
    setLoading(false)
  }

  const achievements = [
    { icon: '🎯', label: 'First Task', unlocked: stats.total >= 1 },
    { icon: '✅', label: '5 Completed', unlocked: stats.completed >= 5 },
    { icon: '🔥', label: '3 Sessions', unlocked: sessionStats.completed >= 3 },
    { icon: '💎', label: '10 Tasks', unlocked: stats.total >= 10 },
    { icon: '🏆', label: '100% Rate', unlocked: stats.completionRate === 100 && stats.total > 0 },
    { icon: '⚡', label: 'Power User', unlocked: sessionStats.totalFocusMin >= 120 },
  ]

  return (
    <div className="space-y-6 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold dark:text-white text-slate-800">Profile</h1>
        <p className="text-sm dark:text-slate-400 text-slate-500 mt-1">Your study journey at a glance</p>
      </motion.div>

      {/* Avatar card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="rounded-2xl p-6 dark:bg-white/4 bg-white border dark:border-white/8 border-slate-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center text-white text-3xl font-display font-bold shadow-glow-green">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            {!editing ? (
              <>
                <h2 className="text-xl font-display font-bold dark:text-white text-slate-800">{user?.name}</h2>
                <p className="dark:text-slate-400 text-slate-500 text-sm flex items-center gap-1.5 mt-1">
                  <Mail size={14} /> {user?.email}
                </p>
                <p className="dark:text-slate-500 text-slate-400 text-xs flex items-center gap-1.5 mt-1">
                  <Calendar size={12} /> Member since {formatDate(user?.joinedAt)}
                </p>
                <p className="dark:text-slate-400 text-slate-500 text-sm flex items-center gap-1.5 mt-1">
                  <Target size={14} /> Daily goal: {user?.focusGoal || 120} min
                </p>
              </>
            ) : (
              <div className="space-y-3 w-full max-w-xs">
                <Input label="Display Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                <Input label="Daily Focus Goal (min)" type="number" min="15" max="480" value={form.focusGoal} onChange={e => setForm({ ...form, focusGoal: Number(e.target.value) })} />
              </div>
            )}
          </div>
          <div>
            {!editing
              ? <Button variant="secondary" onClick={() => setEditing(true)}>Edit Profile</Button>
              : <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
                  <Button onClick={handleSave} loading={loading}>Save</Button>
                </div>
            }
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { value: stats.total, label: 'Tasks Created', color: 'text-brand-400' },
          { value: stats.completed, label: 'Completed', color: 'text-cyan-400' },
          { value: `${stats.completionRate}%`, label: 'Success Rate', color: 'text-purple-400' },
          { value: sessionStats.completed, label: 'Sessions', color: 'text-amber-400' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4 dark:bg-white/4 bg-white border dark:border-white/8 border-slate-200 text-center">
            <div className={`text-2xl font-display font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs dark:text-slate-400 text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Achievements */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="rounded-2xl p-5 dark:bg-white/4 bg-white border dark:border-white/8 border-slate-200">
        <h2 className="text-sm font-display font-semibold dark:text-white text-slate-800 mb-4">Achievements</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {achievements.map(ach => (
            <div key={ach.label} className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
              ach.unlocked
                ? 'dark:bg-brand-500/10 bg-brand-50 dark:border-brand-500/20 border-brand-200'
                : 'dark:bg-white/2 bg-slate-50 dark:border-white/5 border-slate-100 opacity-40'
            }`}>
              <span className="text-2xl">{ach.icon}</span>
              <span className="text-xs text-center dark:text-slate-400 text-slate-500 leading-tight">{ach.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
