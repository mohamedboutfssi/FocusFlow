import { motion } from 'framer-motion'
import Button from './Button'

export default function EmptyState({ icon, title, description, action, actionLabel }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-display font-semibold dark:text-white text-slate-800 mb-2">{title}</h3>
      <p className="text-sm dark:text-slate-400 text-slate-500 max-w-sm mb-6">{description}</p>
      {action && (
        <Button onClick={action}>{actionLabel}</Button>
      )}
    </motion.div>
  )
}
