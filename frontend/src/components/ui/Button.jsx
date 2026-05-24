import { motion } from 'framer-motion'
import { cn } from '../../utils/helpers'

const variants = {
  primary: 'bg-brand-500 hover:bg-brand-600 text-white shadow-glow-green',
  secondary: 'bg-white/10 hover:bg-white/15 text-white border border-white/10',
  ghost: 'hover:bg-white/8 text-slate-300 hover:text-white',
  danger: 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/20',
  outline: 'border border-brand-500/50 hover:border-brand-500 text-brand-400 hover:bg-brand-500/10',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
  xl: 'px-8 py-4 text-base rounded-2xl',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  icon,
  iconRight,
  ...props
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={cn(
        'inline-flex items-center gap-2 font-body font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed select-none',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      ) : icon}
      {children}
      {iconRight && !loading && iconRight}
    </motion.button>
  )
}
