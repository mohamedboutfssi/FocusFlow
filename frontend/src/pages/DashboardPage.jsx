import { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CheckSquare, Zap, Clock, TrendingUp, ArrowRight, Plus } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { useAuth } from '../context/AuthContext'
import { useTasks } from '../context/TaskContext'
import { useSession } from '../context/SessionContext'
import { StatCard } from '../components/ui/Card'
import { PriorityBadge } from '../components/ui/Badge'
import { getRandomQuote } from '../data/quotes'
import { formatDate } from '../utils/helpers'
import { fetchRandomQuote } from '../utils/api'

const WEEK = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const COLORS = ['#22c55e', '#f59e0b', '#06b6d4']

export default function DashboardPage() {
  const { user } = useAuth()
  const { tasks, stats } = useTasks()
  const { sessionStats } = useSession()

  // Quote: try backend first, fall back to local static list
  const [quote, setQuote] = useState(getRandomQuote())
  useEffect(() => {
    fetchRandomQuote().then(serverQuote => {
      if (serverQuote) setQuote(serverQuote)
    })
  }, [])

  const weekData = useMemo(() =>
    WEEK.map(day => ({
      day,
      completed: Math.floor(Math.random() * 6),
      focus: Math.floor(Math.random() * 90 + 10),
    })), [])

  const pieData = [
    { name: 'Completed', value: stats.completed || 1 },
    { name: 'Medium',    value: tasks.filter(t => !t.completed && t.priority === 'medium').length || 1 },
    { name: 'High',      value: tasks.filter(t => !t.completed && t.priority === 'high').length || 1 },
  ]

  const recentTasks = [...tasks].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold dark:text-white text-slate-800">
            {greeting}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm dark:text-slate-400 text-slate-500 mt-1">Here's your productivity overview</p>
        </div>
        <Link to="/tasks" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors">
          <Plus size={16} /> Add Task
        </Link>
      </motion.div>

      {/* Quote banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="relative overflow-hidden rounded-2xl p-5 dark:bg-gradient-to-r dark:from-brand-500/10 dark:to-cyan-500/10 bg-gradient-to-r from-brand-50 to-cyan-50 border dark:border-brand-500/20 border-brand-200"
      >
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-5xl opacity-20">💡</div>
        <p className="text-sm font-medium dark:text-brand-300 text-brand-700 italic">"{quote.text}"</p>
        <p className="text-xs dark:text-brand-400/60 text-brand-500 mt-1">— {quote.author}</p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: <CheckSquare size={18}/>, label: 'Total Tasks',    value: stats.total,          color: 'green',  sub: `${stats.pending} pending` },
          { icon: <TrendingUp size={18}/>,  label: 'Completed',      value: stats.completed,      color: 'cyan',   sub: `${stats.completionRate}% rate` },
          { icon: <Clock size={18}/>,       label: 'Focus Minutes',  value: stats.totalMinutes,   color: 'purple', sub: 'Total focused' },
          { icon: <Zap size={18}/>,         label: 'Sessions Done',  value: sessionStats.completed, color: 'amber', sub: `${sessionStats.totalFocusMin} min total` },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Area chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 rounded-2xl p-5 dark:bg-white/4 bg-white border dark:border-white/8 border-slate-200">
          <h2 className="text-sm font-display font-semibold dark:text-white text-slate-800 mb-1">Focus Time This Week</h2>
          <p className="text-xs dark:text-slate-500 text-slate-400 mb-4">Minutes of deep work per day</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={weekData}>
              <defs>
                <linearGradient id="focusGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#f1f5f9', fontSize: 12 }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Area type="monotone" dataKey="focus" stroke="#22c55e" strokeWidth={2} fill="url(#focusGrad)" dot={false} activeDot={{ r: 4, fill: '#22c55e' }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="rounded-2xl p-5 dark:bg-white/4 bg-white border dark:border-white/8 border-slate-200">
          <h2 className="text-sm font-display font-semibold dark:text-white text-slate-800 mb-1">Tasks Breakdown</h2>
          <p className="text-xs dark:text-slate-500 text-slate-400 mb-4">By status</p>
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" strokeWidth={0}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-2 justify-center">
              {pieData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1.5 text-xs dark:text-slate-400 text-slate-500">
                  <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                  {d.name}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bar chart + Recent tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bar chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-2xl p-5 dark:bg-white/4 bg-white border dark:border-white/8 border-slate-200">
          <h2 className="text-sm font-display font-semibold dark:text-white text-slate-800 mb-1">Tasks Completed</h2>
          <p className="text-xs dark:text-slate-500 text-slate-400 mb-4">Per day this week</p>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={weekData} barSize={20}>
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#f1f5f9', fontSize: 12 }} />
              <Bar dataKey="completed" fill="#06b6d4" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent tasks */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="rounded-2xl p-5 dark:bg-white/4 bg-white border dark:border-white/8 border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-display font-semibold dark:text-white text-slate-800">Recent Tasks</h2>
            <Link to="/tasks" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {recentTasks.length === 0 ? (
            <div className="text-center py-8 dark:text-slate-500 text-slate-400 text-sm">
              No tasks yet. <Link to="/tasks" className="text-brand-400">Add one!</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recentTasks.map(task => (
                <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl dark:bg-white/3 bg-slate-50 dark:hover:bg-white/5 hover:bg-slate-100 transition-colors">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${task.completed ? 'bg-brand-400' : 'bg-slate-500'}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate font-medium ${task.completed ? 'line-through dark:text-slate-500 text-slate-400' : 'dark:text-white text-slate-800'}`}>
                      {task.title}
                    </p>
                    <p className="text-xs dark:text-slate-500 text-slate-400">{formatDate(task.createdAt)}</p>
                  </div>
                  <PriorityBadge priority={task.priority} />
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
