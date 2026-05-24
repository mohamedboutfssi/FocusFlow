import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const TaskContext = createContext(null)

export function TaskProvider({ children }) {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])

  const storageKey = user ? `ff_tasks_${user.id}` : null

  useEffect(() => {
    if (!storageKey) { setTasks([]); return }
    try {
      const stored = localStorage.getItem(storageKey)
      setTasks(stored ? JSON.parse(stored) : [])
    } catch {
      setTasks([])
    }
  }, [storageKey])

  const persist = useCallback((updated) => {
    setTasks(updated)
    if (storageKey) localStorage.setItem(storageKey, JSON.stringify(updated))
  }, [storageKey])

  const addTask = (data) => {
    const task = {
      id: crypto.randomUUID(),
      title: data.title,
      description: data.description || '',
      priority: data.priority || 'medium',
      estimatedMinutes: Number(data.estimatedMinutes) || 25,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
      tags: data.tags || [],
    }
    persist([...tasks, task])
    toast.success('Task added! ✅')
    return task
  }

  const updateTask = (id, updates) => {
    const updated = tasks.map(t => t.id === id ? { ...t, ...updates } : t)
    persist(updated)
  }

  const deleteTask = (id) => {
    persist(tasks.filter(t => t.id !== id))
    toast('Task deleted', { icon: '🗑️' })
  }

  const toggleComplete = (id) => {
    const updated = tasks.map(t =>
      t.id === id
        ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : null }
        : t
    )
    persist(updated)
    const task = tasks.find(t => t.id === id)
    if (task && !task.completed) toast.success('Task completed! 🎉')
  }

  const getTasksByPriority = () => {
    const order = { high: 0, medium: 1, low: 2 }
    return [...tasks].sort((a, b) => order[a.priority] - order[b.priority])
  }

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    completionRate: tasks.length ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0,
    totalMinutes: tasks.filter(t => t.completed).reduce((sum, t) => sum + t.estimatedMinutes, 0),
  }

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, toggleComplete, getTasksByPriority, stats }}>
      {children}
    </TaskContext.Provider>
  )
}

export const useTasks = () => {
  const ctx = useContext(TaskContext)
  if (!ctx) throw new Error('useTasks must be used inside TaskProvider')
  return ctx
}
