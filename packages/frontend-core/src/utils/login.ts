import { MAX_SESSIONS_PER_USER } from "@budibase/shared-core"

const SESSIONS_INVALIDATED_KEY = "bb-sessions-invalidated"

// export function checkIfSessionsInvalidatedAndNotify() {
export function popNumSessionsInvalidated() {
  const invalidatedCount = parseInt(
    localStorage.getItem(SESSIONS_INVALIDATED_KEY) || "0",
    10
  )
  localStorage.removeItem(SESSIONS_INVALIDATED_KEY)
  return invalidatedCount
}

export function pushNumSessionsInvalidated(num: number) {
  const currentCount = parseInt(
    localStorage.getItem(SESSIONS_INVALIDATED_KEY) || "0",
    10
  )
  localStorage.setItem(
    SESSIONS_INVALIDATED_KEY,
    (currentCount + num).toString()
  )
}

export function invalidationMessage(num: number) {
  const sessionText = num === 1 ? "session" : "sessions"
  return `You've been logged out of ${num} other ${sessionText} because users are only allowed ${MAX_SESSIONS_PER_USER} active sessions at any one time.`
}
