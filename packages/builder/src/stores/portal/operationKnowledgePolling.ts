interface PollingState {
  agentId: string
  interval: ReturnType<typeof setInterval>
  inFlight: boolean
  continuous: boolean
}

export interface OperationKnowledgePollingController {
  setContinuous: (agentId: string, enabled: boolean) => void
  stop: () => void
}

export const createOperationKnowledgePollingController = ({
  intervalMs,
  onPoll,
  onError,
}: {
  intervalMs: number
  onPoll: (agentId: string) => Promise<void>
  onError?: (error: unknown) => void
}): OperationKnowledgePollingController => {
  let state: PollingState | undefined

  const stop = () => {
    if (!state) {
      return
    }
    clearInterval(state.interval)
    state = undefined
  }

  const tick = async (agentId: string) => {
    if (!state || state.agentId !== agentId || state.inFlight) {
      return
    }
    if (!state.continuous) {
      stop()
      return
    }

    state.inFlight = true
    try {
      await onPoll(agentId)
    } finally {
      if (state?.agentId === agentId) {
        state.inFlight = false
        if (!state.continuous) {
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
    if (!enabled) {
      stop()
    }
  }

  return {
    setContinuous,
    stop,
  }
}
