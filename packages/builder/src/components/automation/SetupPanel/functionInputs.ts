import { findHBSBlocks } from "@budibase/string-templates"

export const isFunctionInputsObject = (value: string) => {
  if (findHBSBlocks(value)?.length) {
    return true
  }
  try {
    const parsed = JSON.parse(value)
    return !!parsed && typeof parsed === "object" && !Array.isArray(parsed)
  } catch {
    return false
  }
}
