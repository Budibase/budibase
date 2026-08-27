export const createLatestRequestQueue = <T>(
  run: (query: T) => Promise<void>
) => {
  let pending: T | undefined
  let running = false

  return async (query: T) => {
    pending = query
    if (running) return

    running = true
    try {
      while (pending) {
        const next = pending
        pending = undefined
        await run(next)
      }
    } finally {
      running = false
    }
  }
}
