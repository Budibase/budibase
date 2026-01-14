interface OperationText {
  operationId?: string
  summary?: string
  description?: string
}

const OPERATION_ID_MAX_LENGTH = 60
const RESOURCE_SEGMENTS_LIMIT = 2
const MAX_TEXT_LENGTH = 80

const isSimpleOperationId = (operationId?: string): boolean => {
  if (!operationId) {
    return false
  }
  const trimmed = operationId.trim()
  if (!trimmed) {
    return false
  }
  if (trimmed.length > OPERATION_ID_MAX_LENGTH) {
    return false
  }
  if (/[{}]/.test(trimmed)) {
    return false
  }
  return true
}

const getShortText = (value?: string): string | undefined => {
  if (!value) {
    return undefined
  }
  const trimmed = value.trim()
  if (!trimmed) {
    return undefined
  }
  const firstLine = trimmed
    .split(/\r?\n/)
    .map(line => line.trim())
    .find(line => line.length > 0)
  if (!firstLine) {
    return undefined
  }
  if (firstLine.length > MAX_TEXT_LENGTH) {
    return `${firstLine.slice(0, MAX_TEXT_LENGTH - 3).trim()}...`
  }
  return firstLine
}

const isVersionSegment = (segment: string): boolean => {
  const lower = segment.toLowerCase()
  return (
    /^v\d+$/.test(lower) ||
    /^\d{4}-\d{2}(-\d{2})?$/.test(lower) ||
    /^\d+$/.test(lower)
  )
}

const isPathParamSegment = (segment: string): boolean => {
  return segment.startsWith("{") && segment.endsWith("}")
}

const humanizeSegment = (segment: string): string => {
  const spaced = segment
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
  return spaced
    .split(/\s+/)
    .filter(Boolean)
    .map(word => `${word[0].toUpperCase()}${word.slice(1)}`)
    .join(" ")
}

const buildResourceName = (segments: string[]): string => {
  if (!segments.length) {
    return ""
  }
  const selected =
    segments.length > RESOURCE_SEGMENTS_LIMIT
      ? segments.slice(-RESOURCE_SEGMENTS_LIMIT)
      : segments
  return selected.map(humanizeSegment).join(" ")
}

const buildFallbackName = (methodName: string, path: string): string => {
  const normalizedMethod = methodName.trim()
  let segments = path.split("/").filter(Boolean)
  segments = segments.filter(
    segment => !isVersionSegment(segment) && !isPathParamSegment(segment)
  )
  const resource = buildResourceName(segments)
  const methodLabel = normalizedMethod
    ? `${normalizedMethod[0].toUpperCase()}${normalizedMethod
        .slice(1)
        .toLowerCase()}`
    : "Call"
  if (!resource) {
    return methodLabel
  }
  return `${methodLabel} ${resource}`
}

export const buildEndpointName = (
  operation: OperationText,
  methodName: string,
  path: string
): string => {
  if (isSimpleOperationId(operation.operationId)) {
    return operation.operationId?.trim() || path
  }
  const summary = getShortText(operation.summary)
  if (summary) {
    return summary
  }
  const description = getShortText(operation.description)
  if (description) {
    return description
  }
  return buildFallbackName(methodName, path)
}
