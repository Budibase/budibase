import * as automationUtils from "./automationUtils"
import { isPlainObject } from "lodash"

type ObjValue = {
  [key: string]: string | ObjValue
}

export function replaceFakeBindings(
  originalStepInput: Record<string, any>,
  loopStepNumber: number
) {
  for (const [key, value] of Object.entries(originalStepInput)) {
    originalStepInput[key] = replaceBindingsRecursive(value, loopStepNumber)
  }
  return originalStepInput
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
