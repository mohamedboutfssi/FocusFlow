import { cn, priorityConfig } from '../../utils/helpers'

export function PriorityBadge({ priority }) {
  const cfg = priorityConfig[priority] || priorityConfig.medium
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border', cfg.bg, cfg.color, cfg.border)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
      {cfg.label}
    </span>
  )
}

export function Badge({ children, color = 'default', className = '' }) {
  const colors = {
    default: 'bg-white/8 text-slate-300 border-white/10',
    green:   'bg-brand-400/10 text-brand-400 border-brand-400/20',
    cyan:    'bg-cyan-400/10 text-cyan-400 border-cyan-400/20',
    amber:   'bg-amber-400/10 text-amber-400 border-amber-400/20',
    rose:    'bg-rose-400/10 text-rose-400 border-rose-400/20',
    purple:  'bg-purple-400/10 text-purple-400 border-purple-400/20',
  }
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', colors[color], className)}>
      {children}
    </span>
  )
}
