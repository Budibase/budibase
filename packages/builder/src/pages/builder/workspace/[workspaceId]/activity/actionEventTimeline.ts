import dayjs from "dayjs"
import { ActionFailureReason, Event, type ActionEvent } from "@budibase/types"
import type { ActivityTimelineItem } from "./ActivityTimeline.svelte"

const FAILURE_REASON_LABELS: Record<ActionFailureReason, string> = {
  [ActionFailureReason.ERROR]: "Error",
  [ActionFailureReason.MAX_ITERATIONS]: "Maximum iterations reached",
  [ActionFailureReason.FAILURE_CONDITION]: "Failure condition met",
  [ActionFailureReason.INCORRECT_TYPE]: "Incorrect input type",
  [ActionFailureReason.NO_CONDITION_MET]: "No condition met",
}

const isFailureReason = (value: unknown): value is ActionFailureReason =>
  Object.values<unknown>(ActionFailureReason).includes(value)

const getString = (payload: Record<string, unknown>, key: string) => {
  const value = payload[key]
  return typeof value === "string" && value ? value : undefined
}

const getFailureDetail = (payload: Record<string, unknown>) => {
  const errorMessage = getString(payload, "errorMessage")
  if (errorMessage) {
    return errorMessage
  }
  const reason = payload.reason
  return isFailureReason(reason) ? FAILURE_REASON_LABELS[reason] : undefined
}

const formatTimestamp = (value: string) => {
  const date = dayjs(value)
  return date.isValid() ? date.format("MMM D, YYYY h:mm A") : "Unknown time"
}

export const toActionTimelineItem = ({
  event,
  stepNames,
  agentNames,
}: {
  event: ActionEvent
  stepNames: Record<string, string>
  agentNames: Record<string, string>
}): ActivityTimelineItem => {
  const { payload } = event
  const stepId = getString(payload, "stepId")
  const stepName = (stepId && stepNames[stepId]) || stepId || "Unknown step"
  const agentId = getString(payload, "agentId")
  const agentName = (agentId && agentNames[agentId]) || "Unknown agent"

  const item = {
    id: event.id,
    timestamp: formatTimestamp(event.timestamp),
  }

  switch (event.eventName) {
    case Event.ACTION_AUTOMATION_STEP_EXECUTED:
      return { ...item, label: `Step executed: ${stepName}` }
    case Event.ACTION_AUTOMATION_STEP_FAILED:
      return {
        ...item,
        label: `Step failed: ${stepName}`,
        detail: getFailureDetail(payload),
      }
    case Event.ACTION_AI_AGENT_EXECUTED:
      return {
        ...item,
        label: `Agent executed: ${agentName}`,
        detail:
          payload.awaitingEscalation === true
            ? "Waiting for approval"
            : undefined,
      }
    case Event.ACTION_AI_AGENT_FAILED:
      return {
        ...item,
        label: `Agent failed: ${agentName}`,
        detail: getFailureDetail(payload),
      }
    default:
      return { ...item, label: event.eventName || "Unknown event" }
  }
}
