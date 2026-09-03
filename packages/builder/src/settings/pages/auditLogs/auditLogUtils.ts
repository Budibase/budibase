export const createLatestRequestQueue = <T>(
  run: (query: T) => Promise<void>
) => {
  let pending: { query: T } | undefined
  let running = false

  return async (query: T) => {
    pending = { query }
    if (running) return

    running = true
    try {
      while (pending) {
        const next = pending.query
        pending = undefined
        await run(next)
      }
    } finally {
      running = false
    }
  }
}
