import { cn } from '../../utils/helpers'

export default function Input({
  label,
  error,
  icon,
  className = '',
  containerClass = '',
  hint,
  ...props
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', containerClass)}>
      {label && (
        <label className="text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <input
          className={cn(
'w-full bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-500',            'focus:outline-none focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20',
            'transition-all duration-200',
            'dark:bg-white/5 dark:text-white',
            icon && 'pl-10',
            error && 'border-rose-500/50 focus:border-rose-500/60 focus:ring-rose-500/20',
            className
          )}
          {...props}
        />
      </div>
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  )
}

export function Textarea({ label, error, className = '', containerClass = '', ...props }) {
  return (
    <div className={cn('flex flex-col gap-1.5', containerClass)}>
      {label && <label className="text-sm font-medium text-slate-300">{label}</label>}
      <textarea
        className={cn(
'w-full bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-500',          'focus:outline-none focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200',
          error && 'border-rose-500/50',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  )
}

export function Select({ label, error, children, className = '', containerClass = '', ...props }) {
  return (
    <div className={cn('flex flex-col gap-1.5', containerClass)}>
      {label && <label className="text-sm font-medium text-slate-300">{label}</label>}
      <select
        className={cn(
          'w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white',
          'focus:outline-none focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200',
          'appearance-none cursor-pointer',
          error && 'border-rose-500/50',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  )
}
