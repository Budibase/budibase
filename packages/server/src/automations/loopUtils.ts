import { AutomationErrors } from "../constants"
import * as automationUtils from "./automationUtils"
import env from "../environment"
import { LoopInput } from "../definitions/automations"

export function initializeTempOutput(loopSteps: any, iterationCount: number) {
  return { items: loopSteps, iterations: iterationCount }
}

export function typecastLoopInput(
  loopStep: any,
  loopStepNumber: number,
  step: any,
  tempOutput: any,
  updateContextAndOutput: Function
): boolean {
  try {
    loopStep.inputs.binding = automationUtils.typecastForLooping(
      loopStep.inputs as LoopInput
    )
  } catch (err) {
    updateContextAndOutput(loopStepNumber, step, tempOutput, {
      status: AutomationErrors.INCORRECT_TYPE,
      success: false,
    })
    return false
  }
  return true
}

export function getLoopItems(binding: any, option: string | undefined): any[] {
  if (typeof binding === "string" && option === "String") {
    return automationUtils.stringSplit(binding)
  } else if (Array.isArray(binding)) {
    return binding
  }
  return []
}

export function updateContext(
  context: any,
  loopStepNumber: number,
  item: any[],
  index: number
) {
  context.steps[loopStepNumber] = { currentItem: item[index] }
}

export function replaceFakeBindings(
  originalStepInput: any,
  loopStepNumber: number
) {
  for (const [key, value] of Object.entries(originalStepInput)) {
    originalStepInput[key] = replaceBindingsRecursive(
      value,
      key,
      loopStepNumber
    )
  }
  return originalStepInput
}

function replaceBindingsRecursive(
  value: any,
  key: string,
  loopStepNumber: number
) {
  if (typeof value === "object") {
    for (const [innerKey, innerValue] of Object.entries(value)) {
      if (typeof innerValue === "string") {
        value[innerKey] = automationUtils.substituteLoopStep(
          innerValue,
          `steps.${loopStepNumber}`
        )
      } else if (typeof innerValue === "object") {
        value[innerKey] = replaceBindingsRecursive(
          innerValue,
          innerKey,
          loopStepNumber
        )
      }
    }
  } else if (typeof value === "string") {
    value = automationUtils.substituteLoopStep(value, `steps.${loopStepNumber}`)
  }
  return value
}

export function checkMaxIterations(
  index: number,
  iterations: string | undefined
): boolean {
  return (
    index === env.AUTOMATION_MAX_ITERATIONS ||
    (iterations !== undefined && index === parseInt(iterations))
  )
}

export function handleMaxIterations(
  loopStepNumber: number,
  step: any,
  tempOutput: any,
  updateContextAndOutput: Function
) {
  updateContextAndOutput(loopStepNumber, step, tempOutput, {
    status: AutomationErrors.MAX_ITERATIONS,
    success: true,
  })
}

export function checkFailureCondition(
  context: any,
  loopStepNumber: number,
  loopStep: any
): boolean {
  const currentItem = context.steps[loopStepNumber]?.currentItem
  if (currentItem && typeof currentItem === "object") {
    return Object.keys(currentItem).some(
      value => currentItem[value] === loopStep?.inputs.failure
    )
  } else {
    return currentItem && currentItem === loopStep.inputs.failure
  }
}

export function handleFailureCondition(
  loopStepNumber: number,
  step: any,
  tempOutput: any,
  updateContextAndOutput: Function
) {
  updateContextAndOutput(loopStepNumber, step, tempOutput, {
    status: AutomationErrors.FAILURE_CONDITION,
    success: false,
  })
}
