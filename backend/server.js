const express = require('express')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3001

// ─── Middleware ────────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

// ─── Data ─────────────────────────────────────────────────────

// Motivational quotes (served via API instead of a static file)
const QUOTES = [
  { text: "Small progress is still progress.", author: "Anonymous" },
  { text: "Discipline beats motivation every single day.", author: "FocusFlow" },
  { text: "The secret to getting ahead is getting started.", author: "Mark Twain" },
  { text: "It does not matter how slowly you go, as long as you do not stop.", author: "Confucius" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "The more you do, the more you can do.", author: "William Hazlitt" },
  { text: "One hour of focused work beats eight hours of distraction.", author: "FocusFlow" },
  { text: "Your future self is cheering you on right now.", author: "FocusFlow" },
  { text: "Energy flows where attention goes.", author: "Tony Robbins" },
  { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
  { text: "Concentrate all your thoughts upon the work at hand.", author: "Alexander Graham Bell" },
  { text: "The key is not to prioritize your schedule, but to schedule your priorities.", author: "Stephen Covey" },
  { text: "You are capable of amazing things.", author: "FocusFlow" },
  { text: "Every session counts. Every minute matters.", author: "FocusFlow" },
]

// In-memory store for completed sessions
// (in a real app this would be a database)
const completedSessions = []

// ─── Routes ───────────────────────────────────────────────────

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'FocusFlow API is running 🚀' })
})

/**
 * GET /api/quotes/random
 * Returns a single random motivational quote.
 */
app.get('/api/quotes/random', (req, res) => {
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)]
  res.json(quote)
})

/**
 * GET /api/quotes
 * Returns all available quotes.
 */
app.get('/api/quotes', (req, res) => {
  res.json(QUOTES)
})

/**
 * POST /api/sessions
 * Saves a completed focus session to the server.
 * Body: { userId, sessionId, energyLevel, totalMinutes, taskCount, completedAt }
 */
app.post('/api/sessions', (req, res) => {
  const { userId, sessionId, energyLevel, totalMinutes, taskCount, completedAt } = req.body

  if (!userId || !sessionId) {
    return res.status(400).json({ error: 'userId and sessionId are required' })
  }

  const entry = {
    id: sessionId,
    userId,
    energyLevel: energyLevel || 'medium',
    totalMinutes: totalMinutes || 0,
    taskCount: taskCount || 0,
    completedAt: completedAt || new Date().toISOString(),
    savedAt: new Date().toISOString(),
  }

  completedSessions.push(entry)
  console.log(`✅ Session saved — user: ${userId}, minutes: ${totalMinutes}`)
  res.status(201).json({ success: true, session: entry })
})

/**
 * GET /api/sessions/:userId
 * Returns all completed sessions for a specific user.
 */
app.get('/api/sessions/:userId', (req, res) => {
  const { userId } = req.params
  const userSessions = completedSessions.filter(s => s.userId === userId)
  res.json(userSessions)
})

// ─── Start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 FocusFlow backend running at http://localhost:${PORT}`)
  console.log(`   → GET  /api/quotes/random`)
  console.log(`   → GET  /api/quotes`)
  console.log(`   → POST /api/sessions`)
  console.log(`   → GET  /api/sessions/:userId\n`)
})
