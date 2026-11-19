import {
  AutomationActionStepId,
  AutomationStatus,
  type AutomationResults,
  type AutomationStepResult,
  type AutomationTriggerResult,
} from "@budibase/types"
import {
  ViewMode,
  type EdgeData,
  type FlowBlockContext,
} from "@/types/automations"

export type RunHighlight = "success" | "error" | "stopped"
type AutomationRunResult = AutomationStepResult | AutomationTriggerResult
type BranchRunResult = AutomationRunResult & {
  outputs: {
    branchId?: string
    success?: boolean
  }
}

export interface BranchRunState {
  executed: boolean
  success: boolean
  error: boolean
  stopped: boolean
}

interface BranchRunStateArgs {
  branchResult?: AutomationRunResult | null
  branchId?: string
  runHighlight: RunHighlight | undefined
}

interface EdgeRunHighlightArgs {
  edgeData: EdgeData | undefined
  target: string
  runResults: unknown
  viewMode: ViewMode
  getProgressResult: (blockId: string) => AutomationRunResult | undefined
  getBranchId: (branchStepId: string, branchIdx: number) => string | undefined
}

type ProgressEdgeHighlightArgs = Omit<
  EdgeRunHighlightArgs,
  "runResults" | "viewMode"
>

/**
 * Step IDs that support the continueOnError functionality
 */
export const CONTINUE_ON_ERROR_STEP_IDS = [
  AutomationActionStepId.API_REQUEST,
  AutomationActionStepId.EXECUTE_FUNCTION,
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
export function getRunResults(value: unknown): AutomationResults | undefined {
  return isRunResults(value) ? value : undefined
}

/**
 * Check if a step has outputs (i.e., it ran)
 */
export function didStepRun(result: AutomationRunResult): boolean {
  return !!result.outputs
}

/**
 * Get the last executed result from automation results
 */
export function getLastExecutedResult(
  results: AutomationResults
): AutomationRunResult {
  const executedSteps = results.steps.filter(didStepRun)
  return executedSteps.at(-1) || results.trigger
}

/**
 * Check if a step can continue on error based on its configuration
 */
export function canContinueOnError(result: AutomationRunResult): boolean {
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
  result: AutomationRunResult | undefined | null
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

export function didBranchStopWithoutMatch(
  result: AutomationRunResult | undefined | null
): boolean {
  const outputs = result?.outputs
  return (
    result?.stepId === AutomationActionStepId.BRANCH &&
    !!outputs &&
    typeof outputs === "object" &&
    "success" in outputs &&
    outputs.success === false &&
    !("branchId" in outputs)
  )
}

export function didRunStopWithoutBranchMatch(results: unknown): boolean {
  const runResults = getRunResults(results)
  return !!runResults?.steps.some(didBranchStopWithoutMatch)
}

/**
 * Determine the run highlight state based on automation results
 * Returns "error" if terminal failure, "stopped" if stopped status, "success" otherwise
 */
export function getRunHighlight(results: unknown): RunHighlight | undefined {
  const runResults = getRunResults(results)
  if (!runResults) {
    return undefined
  }
  const lastResult = getLastExecutedResult(runResults)
  if (isTerminalFailure(lastResult)) {
    if (lastResult.outputs.status === AutomationStatus.STOPPED) {
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

export function hasBranchResult(
  value: AutomationRunResult | undefined | null
): value is BranchRunResult {
  return !!value?.outputs && "branchId" in value.outputs
}

export function didBranchResultExecuteBranch(
  branchResult: AutomationRunResult | undefined | null,
  branchId: string | undefined
): boolean {
  return (
    !!branchId &&
    hasBranchResult(branchResult) &&
    branchResult.outputs.branchId === branchId
  )
}

export function getBranchRunState({
  branchResult,
  branchId,
  runHighlight,
}: BranchRunStateArgs): BranchRunState {
  const branchExecuted = didBranchResultExecuteBranch(branchResult, branchId)
  const hasBranchResultValue = hasBranchResult(branchResult)
  const branchStepFailed = isTerminalFailure(branchResult)
  const branchStepFailure =
    branchStepFailed && (branchExecuted || !hasBranchResultValue)
  const branchStoppedWithoutMatch = didBranchStopWithoutMatch(branchResult)
  const error =
    !branchStoppedWithoutMatch &&
    runHighlight !== "stopped" &&
    (branchStepFailure || (branchExecuted && runHighlight === "error"))
  const success = !error && branchExecuted && runHighlight === "success"
  const stopped =
    branchStoppedWithoutMatch ||
    (!error && branchExecuted && runHighlight === "stopped")

  return {
    executed: branchExecuted,
    success,
    error,
    stopped,
  }
}

export function getFlowEdgeRunHighlight({
  edgeData,
  target,
  runResults,
  viewMode,
  getProgressResult,
  getBranchId,
}: EdgeRunHighlightArgs): RunHighlight | undefined {
  if (viewMode !== ViewMode.LOGS) {
    const progressHighlight = getProgressEdgeHighlight({
      edgeData,
      target,
      getProgressResult,
      getBranchId,
    })
    if (progressHighlight) {
      return progressHighlight
    }
  }

  if (!edgeData || !isRunResults(runResults)) {
    return undefined
  }
  const runHighlight = getRunHighlight(runResults)

  if (isBranchEdgeData(edgeData)) {
    if (didBranchStepStopWithoutMatch(runResults, edgeData.branchStepId)) {
      return "stopped"
    }
    if (
      runHighlight !== "stopped" &&
      didBranchStepFailBranch(
        runResults,
        edgeData.branchStepId,
        edgeData.branchIdx,
        getBranchId
      )
    ) {
      return runHighlight
    }
    return didBranchRun(
      runResults,
      edgeData.branchStepId,
      edgeData.branchIdx,
      getBranchId
    )
      ? runHighlight
      : undefined
  }

  if (isBranchContext(edgeData.block)) {
    if (
      didBranchStepStopWithoutMatch(runResults, edgeData.block.branchStepId)
    ) {
      return undefined
    }
    if (
      runHighlight !== "stopped" &&
      didBranchStepFailBranch(
        runResults,
        edgeData.block.branchStepId,
        edgeData.block.branchIdx,
        getBranchId
      )
    ) {
      return runHighlight
    }
    return didBranchRun(
      runResults,
      edgeData.block.branchStepId,
      edgeData.block.branchIdx,
      getBranchId
    )
      ? runHighlight
      : undefined
  }

  if (didBranchStepStopWithoutMatch(runResults, target)) {
    return "stopped"
  }

  if (!didTargetRun(runResults, target)) {
    return undefined
  }
  return didRunStopWithoutBranchMatch(runResults) ? "stopped" : runHighlight
}

function getProgressEdgeHighlight({
  edgeData,
  target,
  getProgressResult,
  getBranchId,
}: ProgressEdgeHighlightArgs): RunHighlight | undefined {
  if (!edgeData) {
    return undefined
  }

  if (isBranchEdgeData(edgeData)) {
    return didProgressBranchRun({
      branchStepId: edgeData.branchStepId,
      branchIdx: edgeData.branchIdx,
      getProgressResult,
      getBranchId,
    })
  }

  const progress = getProgressResult(target)
  if (!progress || !didStepRun(progress)) {
    return undefined
  }
  if (isTerminalFailure(progress)) {
    return progress.outputs.status === AutomationStatus.STOPPED
      ? "stopped"
      : "error"
  }
  return "success"
}

function didTargetRun(results: AutomationResults, target: string): boolean {
  if (target === results.trigger.id) {
    return didStepRun(results.trigger)
  }
  const targetResult = results.steps.find(step => step.id === target)
  return targetResult ? didStepRun(targetResult) : false
}

function didBranchRun(
  results: AutomationResults,
  branchStepId: string,
  branchIdx: number,
  getBranchId: (branchStepId: string, branchIdx: number) => string | undefined
): boolean {
  const branchId = getBranchId(branchStepId, branchIdx)
  if (!branchId) {
    return false
  }
  const result = results.steps.find(step => step.id === branchStepId)
  if (isTerminalFailure(result)) {
    return false
  }
  return didBranchResultExecuteBranch(result, branchId)
}

function didBranchStepFailBranch(
  results: AutomationResults,
  branchStepId: string,
  branchIdx: number,
  getBranchId: (branchStepId: string, branchIdx: number) => string | undefined
): boolean {
  const result = results.steps.find(step => step.id === branchStepId)
  if (!isTerminalFailure(result)) {
    return false
  }
  if (!hasBranchResult(result)) {
    return true
  }

  return didBranchResultExecuteBranch(
    result,
    getBranchId(branchStepId, branchIdx)
  )
}

function didBranchStepStopWithoutMatch(
  results: AutomationResults,
  branchStepId: string
): boolean {
  return didBranchStopWithoutMatch(
    results.steps.find(step => step.id === branchStepId)
  )
}

function didProgressBranchRun({
  branchStepId,
  branchIdx,
  getProgressResult,
  getBranchId,
}: Pick<EdgeRunHighlightArgs, "getProgressResult" | "getBranchId"> & {
  branchStepId: string
  branchIdx: number
}): RunHighlight | undefined {
  const result = getProgressResult(branchStepId)
  if (!result || !didStepRun(result)) {
    return undefined
  }
  const branchId = getBranchId(branchStepId, branchIdx)
  if (!didBranchResultExecuteBranch(result, branchId)) {
    return undefined
  }
  if (isTerminalFailure(result)) {
    return result.outputs.status === AutomationStatus.STOPPED
      ? "stopped"
      : "error"
  }
  return "success"
}

function isBranchEdgeData(
  edgeData: EdgeData
): edgeData is Extract<EdgeData, { isBranchEdge: true }> {
  return "isBranchEdge" in edgeData && edgeData.isBranchEdge === true
}

function isBranchContext(
  value: FlowBlockContext
): value is Extract<FlowBlockContext, { branchNode: true }> {
  return "branchNode" in value && value.branchNode === true
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
