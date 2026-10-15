import type { ContextUser, EscalationReviewParameter } from "@budibase/types"

const MAX_DEPTH = 10
const MAX_STRING_LENGTH = 10_000
const MAX_PARAMETERS_LENGTH = 24_000
const NOT_PROVIDED = "Not provided"

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

const render = (value: DisplayValue): string => {
  if (typeof value === "string") {
    return value
  }
  if (!value || typeof value !== "object") {
    return value === null ? "null" : String(value)
  }
  return JSON.stringify(value, null, 2)
}

const valueAtName = (input: unknown, name: string): unknown =>
  input !== null &&
  (typeof input === "object" || typeof input === "function") &&
  Object.prototype.hasOwnProperty.call(input, name)
    ? (input as Record<string, unknown>)[name]
    : NOT_PROVIDED

// Give each selected parameter a share of the display budget so every
// configured parameter remains visible even when an earlier value is large.
export const formatToolParameters = ({
  input,
  names,
}: {
  input: unknown
  names?: string[]
}): EscalationReviewParameter[] | undefined => {
  const uniqueNames = [
    ...new Set(names?.map(name => name.trim()).filter(Boolean)),
  ]
  if (!uniqueNames.length) {
    return undefined
  }

  const entries = uniqueNames.map(name => [
    name,
    prepareForDisplay(valueAtName(input, name), new WeakSet()),
  ]) as [string, DisplayValue][]
  const separatorsLength = Math.max(0, entries.length - 1) * 2
  const labelsLength = entries.reduce(
    (total, [name]) => total + name.length + 2,
    0
  )
  const valuesBudget = Math.max(
    0,
    MAX_PARAMETERS_LENGTH - labelsLength - separatorsLength
  )

  let remainingBudget = valuesBudget
  return entries.map(([name, value], index) => {
    const remainingEntries = entries.length - index
    const valueBudget = Math.floor(remainingBudget / remainingEntries)
    const formattedValue = truncate(render(value), valueBudget)
    remainingBudget -= formattedValue.length
    return { name, value: formattedValue }
  })
}

export const stringifyToolParameters = (
  parameters: EscalationReviewParameter[]
) => parameters.map(({ name, value }) => `${name}: ${value}`).join("\n\n")

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
