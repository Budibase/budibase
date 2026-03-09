import dayjs from "dayjs"
import type {
  AgentLogEntry,
  AgentLogRequestError,
  AgentLogRequestDetail,
  AgentLogSession,
} from "@budibase/types"
import { formatToolName } from "@budibase/frontend-core"

export interface StepFlow {
  from: string
  to: string
}

export interface ParsedAssistantResponse {
  thinking: string
  response: string
}

export function formatLogDateForApi(
  date: Date,
  { includeTime = false }: { includeTime?: boolean } = {}
): string {
  const isoDate = date.toISOString()
  return includeTime ? isoDate : isoDate.split("T")[0]
}

export function formatTime(dateStr: string): string {
  if (!dateStr) return "-"
  return dayjs(dateStr).format("MMM D, YYYY | HH:mm")
}

export function formatSpend(spend: number): string {
  if (!spend) return "$0.0000"
  return `$${spend.toFixed(4)}`
}

function formatDuration(ms: number, decimals = 1): string {
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(decimals)}s`
}

function getEntryDurationMs(entry: AgentLogEntry): number | null {
  if (!entry.startTime || !entry.endTime) return null
  return new Date(entry.endTime).getTime() - new Date(entry.startTime).getTime()
}

export function getStepDuration(entry: AgentLogEntry): string {
  const ms = getEntryDurationMs(entry)
  if (ms == null) return ""
  return formatDuration(ms)
}

export function isSlowStep(entry: AgentLogEntry): boolean {
  const ms = getEntryDurationMs(entry)
  return ms != null && ms > 2000
}

export function calculateLatency(session: AgentLogSession): string {
  if (!session.entries.length) return "-"
  const first = session.entries[0]
  const last = session.entries[session.entries.length - 1]
  if (!first.startTime || !last.endTime) return "-"
  const ms =
    new Date(last.endTime).getTime() - new Date(first.startTime).getTime()
  return formatDuration(ms, 2)
}

export interface SessionStats {
  inputTokens: number
  outputTokens: number
  spend: number
}

export function getSessionStats(session: AgentLogSession): SessionStats {
  return session.entries.reduce(
    (acc, entry) => {
      return {
        inputTokens: acc.inputTokens + entry.inputTokens,
        outputTokens: acc.outputTokens + entry.outputTokens,
        spend: acc.spend + entry.spend,
      }
    },
    { inputTokens: 0, outputTokens: 0, spend: 0 }
  )
}

function summarizeToolNames(names: string[]): string {
  if (!names.length) {
    return ""
  }

  const counts = new Map<string, number>()
  for (const name of names) {
    counts.set(name, (counts.get(name) || 0) + 1)
  }

  return [...counts.entries()]
    .map(([name, count]) => (count > 1 ? `${name} (x${count})` : name))
    .join(", ")
}

function getToolLabel(name: string, displayName?: string): string {
  return formatToolName(name, displayName).full
}

export function getStepFlow(
  detail: AgentLogRequestDetail | undefined,
  loadingStep: boolean
): StepFlow {
  if (loadingStep) {
    return {
      from: "Loading details",
      to: "...",
    }
  }

  if (!detail) {
    return {
      from: "Model input",
      to: "Model output",
    }
  }

  const inputTools = detail.toolResults.map(result =>
    getToolLabel(result.name, result.displayName)
  )
  const outputTools = detail.toolCalls.map(call =>
    getToolLabel(call.name, call.displayName)
  )

  const from = summarizeToolNames(inputTools) || "Prompt + context"

  const to =
    summarizeToolNames(outputTools) ||
    (detail.error
      ? "Error"
      : detail.response
        ? "Assistant response"
        : "No response")

  return { from, to }
}

function extractUserPrompt(content: string): string {
  const trimmed = content.trim()
  const match = trimmed.match(/(?:^|\n)\s*user:\s*([\s\S]*)$/i)
  return match?.[1]?.trim() || trimmed
}

export function formatMessages(detail: AgentLogRequestDetail): string {
  const userMessages = detail.messages
    .filter(message => message.role.toLowerCase() === "user")
    .map(message => extractUserPrompt(message.content))
    .filter(Boolean)

  if (!userMessages.length) {
    return "No user prompt"
  }

  return userMessages[userMessages.length - 1]
}

export function parseAssistantResponse(
  content: string
): ParsedAssistantResponse {
  const trimmed = content.trim()
  if (!trimmed) {
    return {
      thinking: "",
      response: "",
    }
  }

  const thinkingMatches = [...trimmed.matchAll(/<think>([\s\S]*?)<\/think>/gi)]
  if (thinkingMatches.length) {
    return {
      thinking: thinkingMatches
        .map(match => match[1]?.trim())
        .filter(Boolean)
        .join("\n\n"),
      response: trimmed.replace(/<think>[\s\S]*?<\/think>/gi, "").trim(),
    }
  }

  if (/^<think>/i.test(trimmed)) {
    return {
      thinking: trimmed.replace(/^<think>/i, "").trim(),
      response: "",
    }
  }

  return {
    thinking: "",
    response: trimmed,
  }
}

export function formatErrorDetail(error: AgentLogRequestError): string {
  const lines = [error.message]

  if (error.errorClass) {
    lines.push(`Class: ${error.errorClass}`)
  }
  if (error.code) {
    lines.push(`Code: ${error.code}`)
  }
  if (error.provider) {
    lines.push(`Provider: ${error.provider}`)
  }
  if (error.traceback) {
    lines.push("", error.traceback)
  }

  return lines.join("\n")
}

export function formatStructuredContent(content: string): string {
  const trimmed = content.trim()
  if (!trimmed) {
    return "No data captured"
  }

  const fencedContent =
    trimmed
      .match(/^```(?:json|javascript|js|text)?\s*([\s\S]*?)\s*```$/i)?.[1]
      ?.trim() || trimmed

  if (/^[[{]/.test(fencedContent)) {
    try {
      return JSON.stringify(JSON.parse(fencedContent), null, 2)
    } catch (_error) {
      return fencedContent
    }
  }

  return fencedContent
}
