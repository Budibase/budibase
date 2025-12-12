import {
  AutomationStepResult,
  AutomationTriggerResult,
  TestAutomationResponse,
} from "@budibase/types"

export type AutomationTestProgressStatus =
  | "running"
  | "success"
  | "error"
  | "stopped"
  | "complete"

export interface AutomationTestProgressEvent {
  automationId: string
  appId?: string
  blockId?: string
  stepId?: string
  status: AutomationTestProgressStatus
  occurredAt: number
  result?:
    | AutomationStepResult
    | AutomationTriggerResult
    | TestAutomationResponse
  message?: string
  loop?: {
    current: number
    total: number
  }
}

interface AutomationTestProgressState {
  lastUpdated: number
  events: Record<string, AutomationTestProgressEvent>
  completed?: boolean
  result?:
    | TestAutomationResponse
    | AutomationStepResult
    | AutomationTriggerResult
  error?: string
}

const progressState = new Map<string, AutomationTestProgressState>()

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
    } as AutomationTestProgressState)

  if (event.blockId) {
    state.events[event.blockId] = event
  } else if (event.status !== "running") {
    state.events["__automation__"] = event
  }

  if (event.status === "complete" && event.result) {
    state.result = event.result
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
