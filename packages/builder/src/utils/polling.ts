interface PollingOptions {
  intervalMs: number
  poll: () => Promise<void>
  shouldPoll: () => boolean
  onError?: (error: unknown) => void
  immediate?: boolean
}

export const createPolling = ({
  intervalMs,
  poll,
  shouldPoll,
  onError,
  immediate = false,
}: PollingOptions) => {
  let timeout: ReturnType<typeof setTimeout> | undefined
  let inFlight = false
  let stopped = true

  const clear = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = undefined
    }
  }

  const schedule = () => {
    if (timeout || stopped || !shouldPoll()) {
      return
    }
    timeout = setTimeout(run, intervalMs)
  }

  const run = async () => {
    timeout = undefined
    if (stopped || !shouldPoll()) {
      return
    }
    if (inFlight) {
      schedule()
      return
    }

    inFlight = true
    try {
      await poll()
    } catch (error) {
      onError?.(error)
    } finally {
      inFlight = false
      schedule()
    }
  }

  const start = () => {
    if (!stopped) {
      return
    }
    stopped = false
    if (immediate && shouldPoll()) {
      run()
    } else {
      schedule()
    }
  }

  const stop = () => {
    stopped = true
    clear()
  }

  return { start, stop }
}
