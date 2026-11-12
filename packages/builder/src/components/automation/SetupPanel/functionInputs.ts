import type { JSONValue } from "@budibase/types"

export const parseFunctionInputsObject = (
  value: string
): Record<string, JSONValue> | undefined => {
  try {
    const parsed = JSON.parse(value)
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed
    }
  } catch {
    return
  }
}
