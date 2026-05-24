import { format, isToday, isYesterday, parseISO } from 'date-fns'

export const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export const formatDate = (isoString) => {
  if (!isoString) return ''
  const d = parseISO(isoString)
  if (isToday(d)) return 'Today'
  if (isYesterday(d)) return 'Yesterday'
  return format(d, 'MMM d, yyyy')
}

export const priorityConfig = {
  high:   { label: 'High',   color: 'text-rose-400',   bg: 'bg-rose-400/10',   border: 'border-rose-400/20',   dot: 'bg-rose-400' },
  medium: { label: 'Medium', color: 'text-amber-400',  bg: 'bg-amber-400/10',  border: 'border-amber-400/20',  dot: 'bg-amber-400' },
  low:    { label: 'Low',    color: 'text-brand-400',  bg: 'bg-brand-400/10',  border: 'border-brand-400/20',  dot: 'bg-brand-400' },
}

export const energyConfig = {
  low:    { label: 'Low Energy',    emoji: '🌙', color: '#f59e0b', bg: 'bg-amber-400/10',  text: 'text-amber-400',  border: 'border-amber-400/20' },
  medium: { label: 'Medium Energy', emoji: '⚡', color: '#06b6d4', bg: 'bg-cyan-400/10',   text: 'text-cyan-400',   border: 'border-cyan-400/20' },
  high:   { label: 'High Energy',   emoji: '🔥', color: '#22c55e', bg: 'bg-brand-400/10',  text: 'text-brand-400',  border: 'border-brand-400/20' },
}

export const cn = (...classes) => classes.filter(Boolean).join(' ')

export const generateWeekData = (tasks) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return days.map(day => ({
    day,
    tasks: Math.floor(Math.random() * 8),
    focus: Math.floor(Math.random() * 120),
  }))
}
