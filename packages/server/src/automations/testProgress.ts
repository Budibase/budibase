import { AutomationTestProgressEvent, TestProgressState } from "@budibase/types"

export type { AutomationTestProgressEvent }

interface AutomationTestProgressStateWithTimestamp extends TestProgressState {
  createdAt: number
}

const progressState = new Map<
  string,
  AutomationTestProgressStateWithTimestamp
>()

// TTL for test progress entries (5 minutes)
const TEST_PROGRESS_TTL_MS = 5 * 60 * 1000
// Cleanup interval (run every minute)
const CLEANUP_INTERVAL_MS = 60 * 1000

// Periodically clean up old test progress entries to prevent memory leaks
const cleanupInterval = setInterval(() => {
  const now = Date.now()
  for (const [key, state] of progressState.entries()) {
    if (now - state.createdAt > TEST_PROGRESS_TTL_MS) {
      progressState.delete(key)
    }
  }
}, CLEANUP_INTERVAL_MS)

// Prevent the cleanup interval from keeping the process alive
if (cleanupInterval.unref) {
  cleanupInterval.unref()
}

export function stopCleanup() {
  clearInterval(cleanupInterval)
}

const getKey = (appId: string | undefined, automationId: string) =>
  `${appId || "unknown"}:${automationId}`

export function recordTestProgress(
  appId: string | undefined,
  automationId: string,
  event: AutomationTestProgressEvent
) {
  const key = getKey(appId, automationId)
  const state =
    progressState.get(key) ||
    ({
      events: {},
      lastUpdated: 0,
      createdAt: Date.now(),
    } as AutomationTestProgressStateWithTimestamp)

  if (event.blockId) {
    state.events[event.blockId] = event
  } else if (event.status !== "running") {
    state.events["__automation__"] = event
  }

  if (event.status === "complete") {
    if (event.result) {
      state.result = event.result
    }
    state.completed = true
  }

  if (event.status === "error") {
    state.error = event.message
  }

  state.lastUpdated = event.occurredAt
  progressState.set(key, state)
}

export function getTestProgress(
  appId: string | undefined,
  automationId: string
) {
  const key = getKey(appId, automationId)
  return progressState.get(key)
}

export function clearTestProgress(
  appId: string | undefined,
  automationId: string
) {
  const key = getKey(appId, automationId)
  progressState.delete(key)
}
