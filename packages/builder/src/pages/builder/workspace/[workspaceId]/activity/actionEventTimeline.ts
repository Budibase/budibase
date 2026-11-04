import { z } from "zod"
import {
  ActionFailureReason,
  Event,
  type ActionEvent,
  type ActionSession,
} from "@budibase/types"
import type { ActivityTimelineItem } from "./ActivityTimeline.svelte"
import { formatActivityDate } from "./activityDate"

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

const validationIssueSchema = z.object({ message: z.string() })

const formatFailureMessage = (message: string) => {
  const toolError = message.match(
    /^(?:AI_InvalidToolInputError: )?Invalid input for tool ([^:]+):/
  )
  if (!toolError) {
    return message
  }

  const summary = `Invalid input for tool ${toolError[1]}`
  const marker = "Error message: "
  let detailsStart = message.indexOf(marker)
  while (detailsStart !== -1) {
    try {
      // The SDK includes input values and a serialized validation error. Only
      // display the validation messages, not the submitted payload.
      const issues: unknown = JSON.parse(
        message.slice(detailsStart + marker.length)
      )
      if (Array.isArray(issues)) {
        const messages = issues.flatMap((issue: unknown) => {
          const result = validationIssueSchema.safeParse(issue)
          return result.success ? [result.data.message] : []
        })
        if (messages.length) {
          return `${summary}: ${messages.join("; ")}`
        }
      }
      return summary
    } catch {
      // Submitted values can contain the marker before the actual JSON suffix.
      detailsStart = message.indexOf(marker, detailsStart + marker.length)
    }
  }
  return summary
}

const getFailureDetail = (payload: Record<string, unknown>) => {
  const errorMessage = getString(payload, "errorMessage")
  if (errorMessage) {
    return formatFailureMessage(errorMessage)
  }
  const reason = payload.reason
  return isFailureReason(reason) ? FAILURE_REASON_LABELS[reason] : undefined
}

export const toActionTimelineItem = ({
  event,
  stepNames,
  agentNames,
  session,
}: {
  event: ActionEvent
  stepNames: Record<string, string>
  agentNames: Record<string, string>
  session?: ActionSession
}): ActivityTimelineItem => {
  const { payload } = event
  const stepId = getString(payload, "stepId")
  const stepName = (stepId && stepNames[stepId]) || stepId || "Unknown step"
  const agentId = getString(payload, "agentId")
  const historicalAgentName =
    agentId && session?.assetType === "agent" && session.assetId === agentId
      ? session.assetLabel
      : undefined
  const agentName =
    historicalAgentName || (agentId && agentNames[agentId]) || "Unknown agent"
  const toolName =
    getString(payload, "toolLabel") ||
    getString(payload, "toolName") ||
    "Unknown tool"

  const item = {
    id: event.id,
    timestamp: formatActivityDate(event.timestamp),
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
      if (payload.finalStatus === "failed") {
        return {
          ...item,
          label: `Agent failed: ${agentName}`,
          detail: getFailureDetail(payload),
        }
      }
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
    case Event.ACTION_AI_AGENT_TOOL_EXECUTED:
      return { ...item, label: `Tool executed: ${toolName}` }
    case Event.ACTION_AI_AGENT_TOOL_FAILED:
      return {
        ...item,
        label: `Tool failed: ${toolName}`,
        detail: getFailureDetail(payload),
      }
    default:
      return { ...item, label: event.eventName || "Unknown event" }
  }
}
