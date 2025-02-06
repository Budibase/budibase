import * as automationUtils from "./automationUtils"
import { isPlainObject } from "lodash"

type ObjValue = {
  [key: string]: string | ObjValue
}

export function replaceFakeBindings<T extends Record<string, any>>(
  originalStepInput: T,
  loopStepNumber: number
): T {
  const result: Record<string, any> = {}
  for (const [key, value] of Object.entries(originalStepInput)) {
    result[key] = replaceBindingsRecursive(value, loopStepNumber)
  }
  return result as T
}

function replaceBindingsRecursive(
  value: string | ObjValue,
  loopStepNumber: number
) {
  if (value === null || value === undefined) {
    return value
  }

  if (typeof value === "object") {
    for (const [innerKey, innerValue] of Object.entries(value)) {
      if (typeof innerValue === "string") {
        value[innerKey] = automationUtils.substituteLoopStep(
          innerValue,
          `steps.${loopStepNumber}`
        )
      } else if (
        innerValue &&
        isPlainObject(innerValue) &&
        Object.keys(innerValue).length > 0
      ) {
        value[innerKey] = replaceBindingsRecursive(innerValue, loopStepNumber)
      }
    }
  } else if (typeof value === "string") {
    value = automationUtils.substituteLoopStep(value, `steps.${loopStepNumber}`)
  }
  return value
}
