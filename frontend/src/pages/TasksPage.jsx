import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Pencil, Trash2, Check, Clock, Filter } from 'lucide-react'
import { useTasks } from '../context/TaskContext'
import Button from '../components/ui/Button'
import Input, { Textarea, Select } from '../components/ui/Input'
import Modal from '../components/ui/Modal'
import { PriorityBadge } from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'
import { formatDate } from '../utils/helpers'

const PRIORITIES = ['all', 'high', 'medium', 'low']
const FILTERS = ['all', 'pending', 'completed']

function TaskForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || { title: '', description: '', priority: 'medium', estimatedMinutes: 25 })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.estimatedMinutes || form.estimatedMinutes < 1) e.estimatedMinutes = 'Must be at least 1 min'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSave(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Task Title" placeholder="e.g. Review Chapter 5" value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })} error={errors.title} />
      <Textarea label="Description (optional)" placeholder="Add details..." rows={3} value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })} />
      <div className="grid grid-cols-2 gap-3">
        <Select label="Priority" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
          <option value="high">🔴 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🟢 Low</option>
        </Select>
        <Input label="Duration (min)" type="number" min="1" max="480" value={form.estimatedMinutes}
          onChange={e => setForm({ ...form, estimatedMinutes: Number(e.target.value) })} error={errors.estimatedMinutes} />
      </div>
      <div className="flex gap-2 pt-2">
        <Button type="button" variant="ghost" className="flex-1 justify-center" onClick={onClose}>Cancel</Button>
        <Button type="submit" className="flex-1 justify-center">
          {initial ? 'Update Task' : 'Add Task'}
        </Button>
      </div>
    </form>
  )
}

export default function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask, toggleComplete, stats } = useTasks()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')

  const filtered = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || (filterStatus === 'completed' ? t.completed : !t.completed)
    const matchPriority = filterPriority === 'all' || t.priority === filterPriority
    return matchSearch && matchStatus && matchPriority
  }).sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 }
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    return order[a.priority] - order[b.priority]
  })

  const handleSave = (form) => {
    if (editingTask) {
      updateTask(editingTask.id, form)
    } else {
      addTask(form)
    }
    setModalOpen(false)
    setEditingTask(null)
  }

  const openEdit = (task) => { setEditingTask(task); setModalOpen(true) }
  const openAdd  = ()     => { setEditingTask(null); setModalOpen(true) }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold dark:text-white text-slate-800">Tasks</h1>
          <p className="text-sm dark:text-slate-400 text-slate-500 mt-0.5">{stats.completed}/{stats.total} completed</p>
        </div>
        <Button onClick={openAdd} icon={<Plus size={16} />}>Add Task</Button>
      </motion.div>

      {/* Progress bar */}
      {stats.total > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl p-4 dark:bg-white/4 bg-white border dark:border-white/8 border-slate-200">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="dark:text-slate-300 text-slate-600 font-medium">Overall Progress</span>
            <span className="text-brand-400 font-bold">{stats.completionRate}%</span>
          </div>
          <div className="h-2 dark:bg-white/8 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.completionRate}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-brand-500 to-cyan-500 rounded-full"
            />
          </div>
        </motion.div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 dark:text-slate-400 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm dark:bg-white/5 bg-white border dark:border-white/10 border-slate-200 dark:text-white text-slate-800 dark:placeholder:text-slate-500 placeholder:text-slate-400 focus:outline-none focus:border-brand-500/50 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex dark:bg-white/5 bg-white border dark:border-white/10 border-slate-200 rounded-xl p-1 gap-1">
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilterStatus(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${filterStatus === f ? 'bg-brand-500 text-white' : 'dark:text-slate-400 dark:hover:text-white text-slate-500 hover:text-slate-800'}`}>
                {f}
              </button>
            ))}
          </div>
          <div className="flex dark:bg-white/5 bg-white border dark:border-white/10 border-slate-200 rounded-xl p-1 gap-1">
            {PRIORITIES.map(p => (
              <button key={p} onClick={() => setFilterPriority(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${filterPriority === p ? 'bg-brand-500 text-white' : 'dark:text-slate-400 dark:hover:text-white text-slate-500 hover:text-slate-800'}`}>
                {p === 'all' ? 'All' : p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Task list */}
      {filtered.length === 0 ? (
        <EmptyState icon="📝" title="No tasks found" description={tasks.length === 0 ? "Start by adding your first task to get organized." : "No tasks match your current filters."}
          action={tasks.length === 0 ? openAdd : undefined} actionLabel="Add First Task" />
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`group flex items-start gap-4 p-4 rounded-2xl border transition-all duration-200 dark:bg-white/3 bg-white dark:hover:bg-white/5 hover:bg-slate-50 ${
                  task.completed ? 'dark:border-white/4 border-slate-100 opacity-60' : 'dark:border-white/8 border-slate-200'
                }`}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleComplete(task.id)}
                  className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    task.completed ? 'bg-brand-500 border-brand-500' : 'border-slate-400 dark:border-slate-600 hover:border-brand-500'
                  }`}
                >
                  {task.completed && <Check size={11} className="text-white" strokeWidth={3} />}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start gap-2 mb-1">
                    <p className={`text-sm font-medium ${task.completed ? 'line-through dark:text-slate-500 text-slate-400' : 'dark:text-white text-slate-800'}`}>
                      {task.title}
                    </p>
                    <PriorityBadge priority={task.priority} />
                  </div>
                  {task.description && (
                    <p className="text-xs dark:text-slate-500 text-slate-400 mb-2 line-clamp-2">{task.description}</p>
                  )}
                  <div className="flex items-center gap-3 text-xs dark:text-slate-500 text-slate-400">
                    <span className="flex items-center gap-1"><Clock size={11} />{task.estimatedMinutes}min</span>
                    <span>{formatDate(task.createdAt)}</span>
                    {task.completed && task.completedAt && <span className="text-brand-400">Completed {formatDate(task.completedAt)}</span>}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button onClick={() => openEdit(task)}
                    className="w-8 h-8 rounded-lg dark:hover:bg-white/8 hover:bg-slate-100 flex items-center justify-center dark:text-slate-400 text-slate-400 hover:text-brand-400 transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => deleteTask(task.id)}
                    className="w-8 h-8 rounded-lg dark:hover:bg-rose-500/10 hover:bg-rose-50 flex items-center justify-center dark:text-slate-400 text-slate-400 hover:text-rose-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingTask(null) }} title={editingTask ? 'Edit Task' : 'New Task'}>
        <TaskForm initial={editingTask} onSave={handleSave} onClose={() => { setModalOpen(false); setEditingTask(null) }} />
      </Modal>
    </div>
  )
}
