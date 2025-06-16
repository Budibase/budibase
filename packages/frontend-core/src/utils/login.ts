import { notifications } from "@budibase/bbui"

const SESSIONS_INVALIDATED_KEY = "bb-sessions-invalidated"

export function checkIfSessionsInvalidatedAndNotify() {
  const invalidatedCount = parseInt(
    localStorage.getItem(SESSIONS_INVALIDATED_KEY) || "0",
    10
  )

  if (invalidatedCount > 0) {
    const sessionText = invalidatedCount === 1 ? "session" : "sessions"
    notifications.info(
      `You've been logged out of ${invalidatedCount} other ${sessionText} because users are only allowed 3 active sessions at any one time.`
    )
    localStorage.removeItem(SESSIONS_INVALIDATED_KEY)
  }
}
