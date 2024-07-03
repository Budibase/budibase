import * as automationUtils from "./automationUtils"

type ObjValue = {
  [key: string]: string | ObjValue
}

export function replaceFakeBindings(
  originalStepInput: Record<string, any>,
  loopStepNumber: number
) {
  console.log(originalStepInput)
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
      } else if (typeof innerValue === "object" && innerValue !== null) {
        value[innerKey] = replaceBindingsRecursive(innerValue, loopStepNumber)
      }
    }
  } else if (typeof value === "string") {
    value = automationUtils.substituteLoopStep(value, `steps.${loopStepNumber}`)
  }
  return value
}
