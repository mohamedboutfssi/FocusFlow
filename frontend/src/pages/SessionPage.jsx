import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Zap, Play, Clock, Coffee, ArrowRight, CheckCircle } from 'lucide-react'
import { useTasks } from '../context/TaskContext'
import { useSession } from '../context/SessionContext'
import Button from '../components/ui/Button'
import { PriorityBadge } from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'

const ENERGY_OPTIONS = [
  {
    level: 'low',
    emoji: '🌙',
    label: 'Low Energy',
    sub: 'Relaxed pace, gentle focus',
    focus: 20, break_: 10,
    color: 'amber',
    gradient: 'from-amber-500/10 to-orange-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
  {
    level: 'medium',
    emoji: '⚡',
    label: 'Medium Energy',
    sub: 'Balanced and productive',
    focus: 35, break_: 7,
    color: 'cyan',
    gradient: 'from-cyan-500/10 to-blue-500/10',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
  },
  {
    level: 'high',
    emoji: '🔥',
    label: 'High Energy',
    sub: 'Deep work, maximum output',
    focus: 50, break_: 5,
    color: 'green',
    gradient: 'from-brand-500/10 to-cyan-500/10',
    border: 'border-brand-500/30',
    text: 'text-brand-400',
    bg: 'bg-brand-500/10',
  },
]

export default function SessionPage() {
  const { tasks } = useTasks()
  const { generateSession, saveSession } = useSession()
  const navigate = useNavigate()
  const [selected, setSelected] = useState('medium')
  const [preview, setPreview] = useState(null)
  const [step, setStep] = useState('select') // select | preview

  const pendingTasks = tasks.filter(t => !t.completed)
  const cfg = ENERGY_OPTIONS.find(e => e.level === selected)

  const handleGenerate = () => {
    if (pendingTasks.length === 0) return
    const session = generateSession(tasks, selected)
    setPreview(session)
    setStep('preview')
  }

  const handleStart = () => {
    saveSession(preview)
    navigate('/timer', { state: { session: preview } })
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold dark:text-white text-slate-800">Smart Session Generator</h1>
        <p className="text-sm dark:text-slate-400 text-slate-500 mt-1">Select your energy level and get a personalized focus plan.</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {step === 'select' && (
          <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
            {/* Energy selector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {ENERGY_OPTIONS.map((opt, i) => (
                <motion.button
                  key={opt.level}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => setSelected(opt.level)}
                  className={`relative text-left p-5 rounded-2xl border-2 transition-all duration-200 ${
                    selected === opt.level
                      ? `bg-gradient-to-br ${opt.gradient} ${opt.border} dark:bg-opacity-100`
                      : 'dark:bg-white/3 bg-white dark:border-white/8 border-slate-200 dark:hover:bg-white/5 hover:bg-slate-50'
                  }`}
                >
                  {selected === opt.level && (
                    <motion.div layoutId="selected-energy" className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${opt.gradient} -z-10`} />
                  )}
                  <div className="text-3xl mb-3">{opt.emoji}</div>
                  <div className={`font-display font-bold text-base mb-1 ${selected === opt.level ? opt.text : 'dark:text-white text-slate-800'}`}>
                    {opt.label}
                  </div>
                  <div className="text-xs dark:text-slate-400 text-slate-500 mb-3">{opt.sub}</div>
                  <div className="flex gap-3 text-xs">
                    <div className={`flex items-center gap-1 ${selected === opt.level ? opt.text : 'dark:text-slate-400 text-slate-500'}`}>
                      <Zap size={11} /> {opt.focus}min focus
                    </div>
                    <div className={`flex items-center gap-1 ${selected === opt.level ? opt.text : 'dark:text-slate-400 text-slate-500'}`}>
                      <Coffee size={11} /> {opt.break_}min break
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Tasks overview */}
            <div className="rounded-2xl p-5 dark:bg-white/4 bg-white border dark:border-white/8 border-slate-200">
              <h2 className="text-sm font-display font-semibold dark:text-white text-slate-800 mb-3">
                Tasks to include ({pendingTasks.length})
              </h2>
              {pendingTasks.length === 0 ? (
                <EmptyState icon="📋" title="No pending tasks" description="Add tasks first to generate a session." />
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {pendingTasks.sort((a,b) => ({high:0,medium:1,low:2}[a.priority] - {high:0,medium:1,low:2}[b.priority])).map(t => (
                    <div key={t.id} className="flex items-center gap-3 p-2.5 rounded-xl dark:bg-white/3 bg-slate-50">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${t.priority === 'high' ? 'bg-rose-400' : t.priority === 'medium' ? 'bg-amber-400' : 'bg-brand-400'}`} />
                      <span className="flex-1 text-sm dark:text-slate-200 text-slate-700 truncate">{t.title}</span>
                      <PriorityBadge priority={t.priority} />
                      <span className="text-xs dark:text-slate-500 text-slate-400 shrink-0">{t.estimatedMinutes}min</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Session estimate */}
            {pendingTasks.length > 0 && (
              <div className={`rounded-2xl p-4 bg-gradient-to-br ${cfg.gradient} border ${cfg.border}`}>
                <p className="text-xs dark:text-slate-400 text-slate-500 mb-1">Estimated session duration</p>
                <p className={`text-2xl font-display font-bold ${cfg.text}`}>
                  ~{pendingTasks.length * cfg.focus + Math.max(0, pendingTasks.length - 1) * cfg.break_} min
                </p>
                <p className="text-xs dark:text-slate-400 text-slate-500 mt-1">
                  {pendingTasks.length} focus block{pendingTasks.length !== 1 ? 's' : ''} + {Math.max(0, pendingTasks.length - 1)} break{pendingTasks.length > 2 ? 's' : ''}
                </p>
              </div>
            )}

            <Button onClick={handleGenerate} size="lg" icon={<Zap size={18} />} disabled={pendingTasks.length === 0} className="w-full sm:w-auto justify-center">
              Generate Session Plan
            </Button>
          </motion.div>
        )}

        {step === 'preview' && preview && (
          <motion.div key="preview" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
            {/* Summary */}
            <div className={`rounded-2xl p-5 bg-gradient-to-br ${cfg.gradient} border ${cfg.border}`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{cfg.emoji}</span>
                <div>
                  <h2 className={`font-display font-bold text-lg ${cfg.text}`}>{cfg.label} Session</h2>
                  <p className="text-xs dark:text-slate-400 text-slate-500">{preview.taskCount} tasks · ~{preview.totalMinutes} minutes total</p>
                </div>
              </div>
            </div>

            {/* Blocks */}
            <div className="space-y-2">
              <h3 className="text-sm font-display font-semibold dark:text-white text-slate-800">Your Session Plan</h3>
              {preview.blocks.map((block, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={`flex items-center gap-4 p-4 rounded-xl border ${
                    block.type === 'focus'
                      ? 'dark:bg-white/4 bg-white dark:border-white/8 border-slate-200'
                      : 'dark:bg-cyan-500/5 bg-cyan-50 dark:border-cyan-500/15 border-cyan-200'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${block.type === 'focus' ? 'bg-brand-500/15' : 'bg-cyan-500/15'}`}>
                    {block.type === 'focus' ? <Zap size={16} className="text-brand-400" /> : <Coffee size={16} className="text-cyan-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium dark:text-white text-slate-800 truncate">
                      {block.type === 'focus' ? block.taskTitle : 'Break Time'}
                    </p>
                    <p className="text-xs dark:text-slate-400 text-slate-500">
                      {block.type === 'focus' ? `Focus block · ${block.durationMin} min` : `Rest · ${block.durationMin} min`}
                    </p>
                  </div>
                  {block.type === 'focus' && <PriorityBadge priority={block.priority} />}
                  <div className="flex items-center gap-1 text-xs dark:text-slate-400 text-slate-500 shrink-0">
                    <Clock size={12} /> {block.durationMin}m
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep('select')}>← Back</Button>
              <Button onClick={handleStart} icon={<Play size={16} />} className="flex-1 justify-center">
                Start Session
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
