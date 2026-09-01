import type { ContextUser } from "@budibase/types"

const MAX_DEPTH = 10
const MAX_STRING_LENGTH = 10_000
const MAX_PARAMETERS_LENGTH = 24_000
const REDACTED = "[REDACTED]"
const INDENT = "  "

type SanitizedValue =
  | string
  | number
  | boolean
  | null
  | SanitizedValue[]
  | { [key: string]: SanitizedValue }

const SENSITIVE_KEY =
  /password|passwd|secret|token|api[_-]?key|authorization|cookie|credential|private[_-]?key/i

const truncate = (value: string, limit: number) => {
  if (value.length <= limit) {
    return value
  }
  const marker = `… [TRUNCATED: ${value.length - limit} characters omitted]`
  if (marker.length >= limit) {
    return marker.slice(0, limit)
  }
  return `${value.slice(0, limit - marker.length)}${marker}`
}

const sanitize = (
  value: unknown,
  seen: WeakSet<object>,
  depth = 0,
  key = ""
): SanitizedValue => {
  if (key && SENSITIVE_KEY.test(key)) {
    return REDACTED
  }
  if (typeof value === "string") {
    return truncate(value, MAX_STRING_LENGTH)
  }
  if (
    value === null ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value
  }
  if (value === undefined) {
    return "[UNDEFINED]"
  }
  if (typeof value === "bigint") {
    return value.toString()
  }
  if (typeof value !== "object") {
    return String(value)
  }
  if (depth >= MAX_DEPTH) {
    return "[MAX DEPTH]"
  }
  if (seen.has(value)) {
    return "[CIRCULAR]"
  }
  seen.add(value)
  if (Array.isArray(value)) {
    return value.map(item => sanitize(item, seen, depth + 1))
  }
  const entries: [string, SanitizedValue][] = Object.entries(value).map(
    ([childKey, childValue]) => [
      childKey,
      sanitize(childValue, seen, depth + 1, childKey),
    ]
  )
  return Object.fromEntries(entries)
}

const isRecord = (
  value: SanitizedValue
): value is { [key: string]: SanitizedValue } =>
  typeof value === "object" && value !== null && !Array.isArray(value)

// Reviewers approve on what they can read, so values are rendered as text
// rather than escaped JSON - a multi-line argument stays multi-line. The
// result carries its own separator: a space when the value sits on the key's
// line, a newline when it needs an indented block beneath it.
const render = (value: SanitizedValue, indent: string): string => {
  if (typeof value === "string") {
    if (!value.includes("\n")) {
      return ` ${value}`
    }
    return `\n${value
      .split("\n")
      .map(line => `${indent}${line}`)
      .join("\n")}`
  }
  if (!value || typeof value !== "object") {
    return ` ${value === null ? "null" : String(value)}`
  }
  const nested = `${indent}${INDENT}`
  if (Array.isArray(value)) {
    if (!value.length) {
      return " []"
    }
    return value.map(item => `\n${indent}-${render(item, nested)}`).join("")
  }
  const entries = Object.entries(value)
  if (!entries.length) {
    return " {}"
  }
  return entries
    .map(([key, child]) => `\n${indent}${key}:${render(child, nested)}`)
    .join("")
}

const renderRoot = (value: SanitizedValue) =>
  render(value, "").replace(/^[ \n]/, "")

// Give each top-level input a share of the display budget so every parameter
// name remains visible even when an earlier value is very large.
export const formatToolParameters = (input: unknown): string => {
  const sanitized = sanitize(input, new WeakSet())
  if (!isRecord(sanitized)) {
    return truncate(renderRoot(sanitized), MAX_PARAMETERS_LENGTH)
  }

  const entries = Object.entries(sanitized)
  if (!entries.length) {
    return "{}"
  }
  const separatorsLength = Math.max(0, entries.length - 1) * 2
  const labelsLength = entries.reduce(
    (total, [key]) => total + key.length + 2,
    0
  )
  const valuesBudget = Math.max(
    0,
    MAX_PARAMETERS_LENGTH - labelsLength - separatorsLength
  )

  let remainingBudget = valuesBudget
  return truncate(
    entries
      .map(([key, value], index) => {
        const remainingEntries = entries.length - index
        const valueBudget = Math.floor(remainingBudget / remainingEntries)
        const formattedValue = truncate(render(value, INDENT), valueBudget)
        remainingBudget -= formattedValue.length
        return `${key}:${formattedValue}`
      })
      .join("\n\n"),
    MAX_PARAMETERS_LENGTH
  )
}

export const truncateReviewField = (value: string, limit = 500): string =>
  truncate(value, limit)

export const requesterLabel = ({
  user,
  automation,
}: {
  user: ContextUser
  // Automation runs act as a synthetic user whose id and email mean nothing to
  // a reviewer, so name the agent that ran instead.
  automation?: { agentName: string }
}): string => {
  if (automation) {
    return `Automation (${automation.agentName})`
  }
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ")
  if (fullName && user.email) {
    return `${fullName} (${user.email})`
  }
  return (
    fullName ||
    user.email ||
    user.globalId ||
    user.userId ||
    user._id ||
    "Unknown requester"
  )
}

export const chunkText = (value: string, limit = 2_500): string[] => {
  const chunks: string[] = []
  for (let offset = 0; offset < value.length; offset += limit) {
    chunks.push(value.slice(offset, offset + limit))
  }
  return chunks.length ? chunks : [""]
}
