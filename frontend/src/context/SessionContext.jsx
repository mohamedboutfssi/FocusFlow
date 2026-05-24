import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { saveSessionToServer } from '../utils/api'

const SessionContext = createContext(null)

const ENERGY_CONFIG = {
  low:    { focusMin: 20, breakMin: 10, label: 'Low Energy',    color: '#f59e0b', emoji: '🌙' },
  medium: { focusMin: 35, breakMin: 7,  label: 'Medium Energy', color: '#06b6d4', emoji: '⚡' },
  high:   { focusMin: 50, breakMin: 5,  label: 'High Energy',   color: '#22c55e', emoji: '🔥' },
}

export function SessionProvider({ children }) {
  const { user } = useAuth()
  const [sessions, setSessions] = useState([])
  const [activeSession, setActiveSession] = useState(null)

  const storageKey = user ? `ff_sessions_${user.id}` : null

  useEffect(() => {
    if (!storageKey) { setSessions([]); return }
    try {
      const stored = localStorage.getItem(storageKey)
      setSessions(stored ? JSON.parse(stored) : [])
    } catch { setSessions([]) }
  }, [storageKey])

  const persist = (updated) => {
    setSessions(updated)
    if (storageKey) localStorage.setItem(storageKey, JSON.stringify(updated))
  }

  const generateSession = (tasks, energyLevel) => {
    const config = ENERGY_CONFIG[energyLevel]
    const pendingTasks = tasks.filter(t => !t.completed)
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    const sorted = [...pendingTasks].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])

    const blocks = []
    sorted.forEach((task, i) => {
      blocks.push({
        type: 'focus',
        taskId: task.id,
        taskTitle: task.title,
        priority: task.priority,
        durationMin: config.focusMin,
        order: blocks.length,
      })
      if (i < sorted.length - 1) {
        blocks.push({
          type: 'break',
          durationMin: config.breakMin,
          order: blocks.length,
        })
      }
    })

    const totalMin = blocks.reduce((sum, b) => sum + b.durationMin, 0)
    const session = {
      id: crypto.randomUUID(),
      energyLevel,
      config,
      blocks,
      totalMinutes: totalMin,
      taskCount: sorted.length,
      createdAt: new Date().toISOString(),
      completedAt: null,
      status: 'pending',
    }
    return session
  }

  const saveSession = (session) => {
    persist([...sessions, session])
    setActiveSession(session)
  }

  const completeSession = (id) => {
    const completedAt = new Date().toISOString()
    const updated = sessions.map(s =>
      s.id === id ? { ...s, status: 'completed', completedAt } : s
    )
    persist(updated)
    if (activeSession?.id === id) setActiveSession(null)

    // Also save to backend (silently — app works fine if backend is offline)
    if (user) {
      const session = sessions.find(s => s.id === id)
      if (session) {
        saveSessionToServer({ ...session, completedAt }, user.id)
      }
    }
  }

  const sessionStats = {
    total: sessions.length,
    completed: sessions.filter(s => s.status === 'completed').length,
    totalFocusMin: sessions
      .filter(s => s.status === 'completed')
      .reduce((sum, s) => sum + s.blocks.filter(b => b.type === 'focus').reduce((a, b) => a + b.durationMin, 0), 0),
  }

  return (
    <SessionContext.Provider value={{
      sessions, activeSession, setActiveSession,
      generateSession, saveSession, completeSession,
      sessionStats, ENERGY_CONFIG,
    }}>
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used inside SessionProvider')
  return ctx
}
