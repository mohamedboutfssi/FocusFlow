import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { Play, Pause, RotateCcw, SkipForward, Coffee, Zap } from 'lucide-react'
import { useSession } from '../context/SessionContext'
import Button from '../components/ui/Button'
import { formatTime } from '../utils/helpers'
import toast from 'react-hot-toast'

const MODES = {
  focus:       { label: 'Focus',       seconds: 25 * 60, color: '#22c55e', emoji: '🎯' },
  short_break: { label: 'Short Break', seconds: 5  * 60, color: '#06b6d4', emoji: '☕' },
  long_break:  { label: 'Long Break',  seconds: 15 * 60, color: '#a855f7', emoji: '😴' },
}

export default function TimerPage() {
  const location = useLocation()
  const { activeSession, completeSession } = useSession()
  const sessionData = location.state?.session

  const [mode, setMode] = useState('focus')
  const [secondsLeft, setSecondsLeft] = useState(MODES.focus.seconds)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const [blockIdx, setBlockIdx] = useState(0)

  const intervalRef = useRef(null)
  const audioCtxRef = useRef(null)

  const current = MODES[mode]
  const blocks = sessionData?.blocks || null

  // Reset on mode change
  useEffect(() => {
    setSecondsLeft(MODES[mode].seconds)
    setRunning(false)
  }, [mode])

  // Load from session if available
  useEffect(() => {
    if (blocks && blocks[blockIdx]) {
      const block = blocks[blockIdx]
      const m = block.type === 'focus' ? 'focus' : 'short_break'
      setMode(m)
      setSecondsLeft(block.durationMin * 60)
      setRunning(false)
    }
  }, [blockIdx, blocks])

  const playDone = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      audioCtxRef.current = ctx
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.setValueAtTime(528, ctx.currentTime)
      osc.frequency.setValueAtTime(660, ctx.currentTime + 0.2)
      osc.frequency.setValueAtTime(784, ctx.currentTime + 0.4)
      gain.gain.setValueAtTime(0.4, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.8)
    } catch {}
  }, [])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            playDone()
            toast.success(`${current.emoji} ${current.label} complete!`, { duration: 4000 })
            if (mode === 'focus') setSessions(n => n + 1)
            return 0
          }
          return s - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, mode, current, playDone])

  const toggle   = () => setRunning(r => !r)
  const reset    = () => { setRunning(false); setSecondsLeft(blocks?.[blockIdx]?.durationMin * 60 || MODES[mode].seconds) }
  const skip     = () => {
    setRunning(false)
    if (blocks && blockIdx < blocks.length - 1) {
      setBlockIdx(i => i + 1)
    } else if (!blocks) {
      setMode(m => m === 'focus' ? 'short_break' : 'focus')
    }
  }

  const total     = blocks?.[blockIdx]?.durationMin * 60 || MODES[mode].seconds
  const progress  = (total - secondsLeft) / total
  const radius    = 120
  const circ      = 2 * Math.PI * radius
  const offset    = circ * (1 - progress)

  const modeColor = current.color

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold dark:text-white text-slate-800">Pomodoro Timer</h1>
        <p className="text-sm dark:text-slate-400 text-slate-500 mt-1">
          {sessions > 0 ? `${sessions} session${sessions !== 1 ? 's' : ''} completed today 🎉` : 'Stay focused. You got this.'}
        </p>
      </motion.div>

      {/* Mode tabs (only if no session) */}
      {!sessionData && (
        <div className="flex dark:bg-white/5 bg-white border dark:border-white/10 border-slate-200 rounded-2xl p-1.5 gap-1">
          {Object.entries(MODES).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                mode === key
                  ? 'bg-brand-500 text-white shadow-glow-green'
                  : 'dark:text-slate-400 dark:hover:text-white text-slate-500 hover:text-slate-800'
              }`}
            >
              {val.emoji} {val.label}
            </button>
          ))}
        </div>
      )}

      {/* Session progress */}
      {sessionData && blocks && (
        <div className="flex gap-1.5">
          {blocks.map((block, i) => (
            <div
              key={i}
              className={`flex-1 h-1.5 rounded-full transition-all ${
                i < blockIdx ? 'bg-brand-500' :
                i === blockIdx ? 'bg-cyan-400' :
                'dark:bg-white/10 bg-slate-200'
              }`}
            />
          ))}
        </div>
      )}

      {/* Timer ring */}
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-center py-4">
        <div className="relative">
          {/* Glow */}
          <div className="absolute inset-0 rounded-full blur-2xl opacity-20" style={{ background: modeColor }} />

          <svg width="300" height="300" className="timer-ring">
            {/* Track */}
            <circle cx="150" cy="150" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
            {/* Progress */}
            <motion.circle
              cx="150" cy="150" r={radius}
              fill="none"
              stroke={modeColor}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              style={{ filter: `drop-shadow(0 0 8px ${modeColor}60)` }}
              transition={{ duration: 0.5 }}
            />
          </svg>

          {/* Time display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-5xl font-mono font-bold dark:text-white text-slate-800 tracking-tight">
              {formatTime(secondsLeft)}
            </div>
            <div className="text-sm dark:text-slate-400 text-slate-500 mt-2 flex items-center gap-1.5">
              {mode === 'focus' ? <Zap size={14} /> : <Coffee size={14} />}
              {sessionData && blocks?.[blockIdx] ? blocks[blockIdx].taskTitle || current.label : current.label}
            </div>
            {running && (
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mt-2 w-2 h-2 rounded-full"
                style={{ background: modeColor }}
              />
            )}
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={reset}
          className="w-12 h-12 rounded-2xl dark:bg-white/6 bg-white border dark:border-white/10 border-slate-200 flex items-center justify-center dark:text-slate-400 text-slate-500 hover:text-rose-400 transition-colors"
        >
          <RotateCcw size={20} />
        </button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggle}
          className="w-20 h-20 rounded-3xl flex items-center justify-center text-white font-semibold text-lg shadow-lg transition-all"
          style={{
            background: `linear-gradient(135deg, ${modeColor}, ${modeColor}99)`,
            boxShadow: `0 0 30px ${modeColor}40`
          }}
        >
          {running ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
        </motion.button>

        <button
          onClick={skip}
          className="w-12 h-12 rounded-2xl dark:bg-white/6 bg-white border dark:border-white/10 border-slate-200 flex items-center justify-center dark:text-slate-400 text-slate-500 hover:text-brand-400 transition-colors"
        >
          <SkipForward size={20} />
        </button>
      </div>

      {/* Session stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Sessions', value: sessions, emoji: '🎯' },
          { label: 'Focus Time', value: `${sessions * 25}m`, emoji: '⏱️' },
          { label: 'Streak', value: `${sessions > 0 ? sessions : 0}🔥`, emoji: '' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4 dark:bg-white/4 bg-white border dark:border-white/8 border-slate-200 text-center">
            <div className="text-xl font-display font-bold dark:text-white text-slate-800">{s.value}</div>
            <div className="text-xs dark:text-slate-400 text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Complete session button */}
      {sessionData && activeSession && (
        <Button variant="outline" className="w-full justify-center" onClick={() => { completeSession(activeSession.id); toast.success('Session completed! 🎉') }}>
          Mark Session Complete
        </Button>
      )}
    </div>
  )
}
