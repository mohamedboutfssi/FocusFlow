import { motion } from 'framer-motion'
import { cn } from '../../utils/helpers'

export default function Card({ children, className = '', hover = false, glow, onClick, ...props }) {
  const base = cn(
    'rounded-2xl border transition-all duration-200',
    'dark:bg-white/4 dark:border-white/8 bg-white border-slate-200',
    hover && 'cursor-pointer hover:-translate-y-1 hover:shadow-card-dark',
    glow === 'green'  && 'hover:border-brand-500/30 hover:shadow-glow-green',
    glow === 'cyan'   && 'hover:border-cyan-500/30 hover:shadow-glow-cyan',
    glow === 'purple' && 'hover:border-purple-500/30 hover:shadow-glow-purple',
    className
  )

  if (hover || onClick) {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className={base}
        onClick={onClick}
        {...props}
      >
        {children}
      </motion.div>
    )
  }

  return <div className={base} {...props}>{children}</div>
}

export function StatCard({ icon, label, value, sub, color = 'green', trend }) {
  const colorMap = {
    green:  { bg: 'bg-brand-500/10',   text: 'text-brand-400',   border: 'border-brand-500/20' },
    cyan:   { bg: 'bg-cyan-500/10',    text: 'text-cyan-400',    border: 'border-cyan-500/20' },
    purple: { bg: 'bg-purple-500/10',  text: 'text-purple-400',  border: 'border-purple-500/20' },
    amber:  { bg: 'bg-amber-500/10',   text: 'text-amber-400',   border: 'border-amber-500/20' },
    rose:   { bg: 'bg-rose-500/10',    text: 'text-rose-400',    border: 'border-rose-500/20' },
  }
  const c = colorMap[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5 dark:bg-white/4 bg-white border dark:border-white/8 border-slate-200 hover:-translate-y-1 transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', c.bg, c.border, 'border')}>
          <span className={c.text}>{icon}</span>
        </div>
        {trend !== undefined && (
          <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', trend >= 0 ? 'text-brand-400 bg-brand-400/10' : 'text-rose-400 bg-rose-400/10')}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="space-y-1">
        <div className="text-2xl font-display font-bold dark:text-white text-slate-800">{value}</div>
        <div className="text-sm font-medium dark:text-slate-300 text-slate-600">{label}</div>
        {sub && <div className="text-xs dark:text-slate-500 text-slate-400">{sub}</div>}
      </div>
    </motion.div>
  )
}
