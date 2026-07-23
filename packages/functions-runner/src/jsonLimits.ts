import type { JSONValue } from "@budibase/types"

export class JSONLimitError extends Error {}

export interface JSONLimits {
  maxBytes: number
  maxDepth: number
}

const visitJSON = (value: JSONValue, maxDepth: number, depth: number): void => {
  if (depth > maxDepth) {
    throw new JSONLimitError()
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      visitJSON(item, maxDepth, depth + 1)
    }
    return
  }
  if (value && typeof value === "object") {
    for (const item of Object.values(value)) {
      visitJSON(item, maxDepth, depth + 1)
    }
  }
}

export const validateJSONLimits = (
  value: JSONValue,
  limits: JSONLimits
): number => {
  visitJSON(value, limits.maxDepth, 0)
  const bytes = Buffer.byteLength(JSON.stringify(value))
  if (bytes > limits.maxBytes) {
    throw new JSONLimitError()
  }
  return bytes
}
