interface PollingState {
  agentId: string
  interval: ReturnType<typeof setInterval>
  inFlight: boolean
}

interface CreateAgentPollingControllerConfig {
  intervalMs: number
  onPoll: (agentId: string) => Promise<void>
  onError?: (error: unknown) => void
}

interface UnifiedPollingState extends PollingState {
  continuous: boolean
}

interface KnowledgePollingController {
  setContinuous: (agentId: string, enabled: boolean) => void
  stop: () => void
  isRunning: () => boolean
}

export const coalesceAgentPollRequests = (
  pollFn: (agentId: string) => Promise<void>
) => {
  let inFlight: Promise<void> | undefined

  return async (agentId: string) => {
    if (inFlight) {
      return await inFlight
    }

    const request = pollFn(agentId)
    inFlight = request
    try {
      await request
    } finally {
      if (inFlight === request) {
        inFlight = undefined
      }
    }
  }
}

export const createKnowledgePollingController = ({
  intervalMs,
  onPoll,
  onError,
}: CreateAgentPollingControllerConfig): KnowledgePollingController => {
  let state: UnifiedPollingState | undefined

  const stop = () => {
    if (!state) {
      return
    }
    clearInterval(state.interval)
    state = undefined
  }

  const shouldStop = () => {
    return !state?.continuous
  }

  const tick = async (agentId: string) => {
    if (!state || state.agentId !== agentId || state.inFlight) {
      return
    }
    if (shouldStop()) {
      stop()
      return
    }

    state.inFlight = true
    try {
      await onPoll(agentId)
    } finally {
      if (state?.agentId === agentId) {
        state.inFlight = false
        if (shouldStop()) {
          stop()
        }
      }
    }
  }

  const ensureState = (agentId: string) => {
    if (state?.agentId === agentId) {
      return
    }
    stop()
    const interval = setInterval(() => {
      tick(agentId).catch(error => {
        onError?.(error)
      })
    }, intervalMs)
    state = {
      agentId,
      interval,
      inFlight: false,
      continuous: false,
    }
  }

  const setContinuous = (agentId: string, enabled: boolean) => {
    if (!agentId) {
      return
    }
    ensureState(agentId)
    if (!state || state.agentId !== agentId) {
      return
    }
    state.continuous = enabled
    if (shouldStop()) {
      stop()
    }
  }

  const isRunning = () => {
    return !!state
  }

  return {
    setContinuous,
    stop,
    isRunning,
  }
}
