import {
  AutomationActionStepId,
  AutomationStatus,
  type AutomationResults,
  type AutomationStepResult,
  type AutomationTriggerResult,
} from "@budibase/types"

export type RunHighlight = "success" | "error" | "stopped"

/**
 * Step IDs that support the continueOnError functionality
 */
export const CONTINUE_ON_ERROR_STEP_IDS = [
  AutomationActionStepId.API_REQUEST,
  AutomationActionStepId.EXECUTE_QUERY,
  AutomationActionStepId.TRIGGER_AUTOMATION_RUN,
] as string[]

/**
 * Type guard to check if a value is valid AutomationResults
 */
export function isRunResults(value: unknown): value is AutomationResults {
  return (
    !!value &&
    typeof value === "object" &&
    "steps" in value &&
    Array.isArray(value.steps) &&
    "trigger" in value &&
    !!value.trigger
  )
}

/**
 * Get run results from a value, returns undefined if not valid results
 */
export function getRunResults(
  value: unknown
): AutomationResults | undefined {
  return isRunResults(value) ? value : undefined
}

/**
 * Check if a step has outputs (i.e., it ran)
 */
export function didStepRun(
  result: AutomationStepResult | AutomationTriggerResult
): boolean {
  return !!result.outputs
}

/**
 * Get the last executed result from automation results
 */
export function getLastExecutedResult(
  results: AutomationResults
): AutomationStepResult | AutomationTriggerResult {
  const executedSteps = results.steps.filter(didStepRun)
  return executedSteps.at(-1) || results.trigger
}

/**
 * Check if a step can continue on error based on its configuration
 */
export function canContinueOnError(
  result: AutomationStepResult | AutomationTriggerResult
): boolean {
  if (!("inputs" in result) || !result.inputs) {
    return false
  }
  if (result.stepId === AutomationActionStepId.EXTRACT_STATE) {
    return true
  }
  return (
    result.inputs.continueOnError === true &&
    CONTINUE_ON_ERROR_STEP_IDS.includes(result.stepId)
  )
}

/**
 * Check if a result represents a terminal state (failure that stops execution)
 */
export function isTerminalFailure(
  result: AutomationStepResult | AutomationTriggerResult | undefined
): boolean {
  if (!result?.outputs) {
    return false
  }

  const outputStatus =
    "status" in result.outputs && typeof result.outputs.status === "string"
      ? result.outputs.status.toLowerCase()
      : undefined

  return (
    (result.outputs.success === false && !canContinueOnError(result)) ||
    outputStatus === AutomationStatus.STOPPED ||
    outputStatus === AutomationStatus.STOPPED_ERROR
  )
}

/**
 * Determine the run highlight state based on automation results
 * Returns "error" if terminal failure, "stopped" if stopped status, "success" otherwise
 */
export function getRunHighlight(
  results: unknown
): RunHighlight | undefined {
  const runResults = getRunResults(results)
  if (!runResults) {
    return undefined
  }
  const lastResult = getLastExecutedResult(runResults)
  if (isTerminalFailure(lastResult)) {
    if (lastResult.outputs.status === "stopped") {
      return "stopped"
    }
    return "error"
  }
  return "success"
}

/**
 * Type guard for results with success output
 */
export function hasSuccessOutput(
  value: unknown
): value is { outputs: { success?: boolean } } {
  return (
    !!value &&
    typeof value === "object" &&
    "outputs" in value &&
    !!value.outputs &&
    typeof value.outputs === "object" &&
    "success" in value.outputs
  )
}

/**
 * Type guard for AutomationStepResult
 */
export function isAutomationStepResult(
  value: unknown
): value is AutomationStepResult {
  return (
    !!value &&
    typeof value === "object" &&
    "inputs" in value &&
    !!value.inputs &&
    "outputs" in value &&
    !!value.outputs &&
    "stepId" in value
  )
}
