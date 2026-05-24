/**
 * api.js — small utility to talk to the FocusFlow backend.
 *
 * The app works 100 % without the backend (localStorage fallback).
 * When the backend IS running, it enhances two features:
 *   1. Quotes  → fetched from /api/quotes/random  (falls back to built-in list)
 *   2. Sessions → completed sessions are also saved on the server
 */

const BASE_URL = 'http://localhost:3001'

// ─── Quotes ───────────────────────────────────────────────────

/**
 * Fetch a random motivational quote from the backend.
 * Returns null if the backend is unreachable.
 */
export async function fetchRandomQuote() {
  try {
    const res = await fetch(`${BASE_URL}/api/quotes/random`, { signal: AbortSignal.timeout(2000) })
    if (!res.ok) return null
    return await res.json()          // { text, author }
  } catch {
    return null                      // backend offline → caller uses local fallback
  }
}

// ─── Sessions ─────────────────────────────────────────────────

/**
 * Save a completed session to the backend.
 * Silently ignores errors so the app keeps working offline.
 *
 * @param {object} session  - session object from SessionContext
 * @param {string} userId   - current user's id
 */
export async function saveSessionToServer(session, userId) {
  try {
    await fetch(`${BASE_URL}/api/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(3000),
      body: JSON.stringify({
        userId,
        sessionId: session.id,
        energyLevel: session.energyLevel,
        totalMinutes: session.totalMinutes,
        taskCount: session.taskCount,
        completedAt: session.completedAt || new Date().toISOString(),
      }),
    })
  } catch {
    // Backend unreachable — session is already saved in localStorage, so no problem
  }
}

/**
 * Fetch all completed sessions for a user from the backend.
 * Returns an empty array if the backend is unreachable.
 */
export async function fetchServerSessions(userId) {
  try {
    const res = await fetch(`${BASE_URL}/api/sessions/${userId}`, { signal: AbortSignal.timeout(2000) })
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}
