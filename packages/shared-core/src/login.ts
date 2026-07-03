const DEFAULT_MAX_SESSIONS_PER_USER = 3

export function getMaxSessionsPerUser(): number {
  const val = parseInt(process.env.BB_MAX_SESSIONS_PER_USER || "", 10)
  if (!isNaN(val) && val > 0) {
    return val
  }
  return DEFAULT_MAX_SESSIONS_PER_USER
}
