import type { ContextUser, EscalationReviewParameter } from "@budibase/types"

const MAX_DEPTH = 10
const MAX_STRING_LENGTH = 10_000
const MAX_PARAMETERS_LENGTH = 24_000
const INDENT = "  "
const UNAVAILABLE = "[UNAVAILABLE]"

type DisplayValue =
  | string
  | number
  | boolean
  | null
  | DisplayValue[]
  | { [key: string]: DisplayValue }

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

const prepareForDisplay = (
  value: unknown,
  seen: WeakSet<object>,
  depth = 0
): DisplayValue => {
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
    return ""
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
    return value.map(item => prepareForDisplay(item, seen, depth + 1))
  }
  const entries: [string, DisplayValue][] = Object.entries(value).map(
    ([childKey, childValue]) => [
      childKey,
      prepareForDisplay(childValue, seen, depth + 1),
    ]
  )
  return Object.fromEntries(entries)
}

// Reviewers approve on what they can read, so values are rendered as text
// rather than escaped JSON - a multi-line argument stays multi-line. The
// result carries its own separator: a space when the value sits on the key's
// line, a newline when it needs an indented block beneath it.
const render = (value: DisplayValue, indent: string): string => {
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

const renderRoot = (value: DisplayValue) =>
  render(value, "").replace(/^[ \n]/, "")

const decodePointer = (path: string): string[] | undefined => {
  if (!path.startsWith("/") || /~(?:[^01]|$)/.test(path)) {
    return undefined
  }
  return path
    .slice(1)
    .split("/")
    .map(segment => segment.replace(/~1/g, "/").replace(/~0/g, "~"))
}

const valueAtPointer = (input: unknown, path: string): unknown => {
  const segments = decodePointer(path)
  if (!segments) {
    return UNAVAILABLE
  }
  let value = input
  for (const segment of segments) {
    if (
      (typeof value !== "object" && typeof value !== "function") ||
      value === null ||
      !Object.prototype.hasOwnProperty.call(value, segment)
    ) {
      return UNAVAILABLE
    }
    value = (value as Record<string, unknown>)[segment]
  }
  return value
}

// Give each selected path a share of the display budget so every configured
// path remains visible even when an earlier value is very large.
export const formatToolParameters = ({
  input,
  paths,
}: {
  input: unknown
  paths?: string[]
}): EscalationReviewParameter[] | undefined => {
  const uniquePaths = [
    ...new Set(paths?.map(path => path.trim()).filter(Boolean)),
  ]
  if (!uniquePaths.length) {
    return undefined
  }

  const entries = uniquePaths.map(path => [
    path,
    prepareForDisplay(valueAtPointer(input, path), new WeakSet()),
  ]) as [string, DisplayValue][]
  const separatorsLength = Math.max(0, entries.length - 1) * 2
  const labelsLength = entries.reduce(
    (total, [path]) => total + path.length + 2,
    0
  )
  const valuesBudget = Math.max(
    0,
    MAX_PARAMETERS_LENGTH - labelsLength - separatorsLength
  )

  let remainingBudget = valuesBudget
  return entries.map(([path, value], index) => {
    const remainingEntries = entries.length - index
    const valueBudget = Math.floor(remainingBudget / remainingEntries)
    const formattedValue = truncate(renderRoot(value), valueBudget)
    remainingBudget -= formattedValue.length
    return { path, value: formattedValue }
  })
}

export const stringifyToolParameters = (
  parameters: EscalationReviewParameter[]
) => parameters.map(({ path, value }) => `${path}: ${value}`).join("\n\n")

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
