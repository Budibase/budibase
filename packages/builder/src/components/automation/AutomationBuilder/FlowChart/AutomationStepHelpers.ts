import { automationStore } from "@/stores/builder"
import { ViewMode } from "@/types/automations"
import {
  Automation,
  AutomationLog,
  AutomationStep,
  AutomationTrigger,
  AutomationStepResult,
  AutomationTriggerResult,
  BranchStep,
  BlockDefinitions,
  AutomationTriggerStepId,
  AutomationActionStepId,
  Branch,
} from "@budibase/types"
import { get } from "svelte/store"

type AutomationLogStep = AutomationTriggerResult | AutomationStepResult
type BranchChild = { id: string; [key: string]: any }

// Type for reconstructed blocks from log data - hybrid of log results + step definitions
type ReconstructedBlock = AutomationLogStep & {
  name: string
  icon: string
}
type AutomationBlock = AutomationStep | AutomationTrigger | ReconstructedBlock

export const processLogSteps = (
  automation: Automation & { blockDefinitions: BlockDefinitions },
  selectedLog: AutomationLog
) => {
  let blocks: AutomationBlock[] = []
  if (automation.definition.trigger) {
    blocks.push(automation.definition.trigger)
  }
  // We want to filter out steps from the top level array that exist
  // in the children of the branch. We want the branch children to be the
  // source of truth.
  const branchChildStepIds = new Set()
  selectedLog.steps.forEach((logStep: AutomationLogStep) => {
    if (
      logStep.stepId === AutomationActionStepId.BRANCH &&
      logStep.outputs?.branchId
    ) {
      const executedBranchId = logStep.outputs.branchId
      const branchChildren = logStep.inputs.children?.[executedBranchId] || []
      branchChildren.forEach((child: BranchChild) => {
        branchChildStepIds.add(child.id)
      })
    }
  })
  selectedLog.steps
    .filter(
      (logStep: AutomationLogStep) =>
        logStep.stepId !== automation.definition.trigger?.stepId
    )
    .filter((logStep: AutomationLogStep) => !branchChildStepIds.has(logStep.id))
    .forEach((logStep: AutomationLogStep) => {
      // Step doesn't exist in current definition, reconstruct from log
      const stepDefinition =
        automation.blockDefinitions?.ACTION?.[
          logStep.stepId as AutomationActionStepId
        ] ||
        automation.blockDefinitions?.TRIGGER?.[
          logStep.stepId as AutomationTriggerStepId
        ]

      blocks.push({
        ...logStep,
        name: stepDefinition?.name || logStep.name || "Unknown Step",
        icon: stepDefinition?.icon || logStep.icon || "default",
      })
    })
  return blocks
}

export const getBlocks = (automation: Automation, viewMode: ViewMode) => {
  const blockDefinitions = get(automationStore).blockDefinitions
  const selectedLog = get(automationStore).selectedLog
  let blocks: AutomationBlock[] = []

  // In logs mode, we need to show steps from the log data
  if (viewMode === ViewMode.LOGS && selectedLog) {
    blocks = processLogSteps({ ...automation, blockDefinitions }, selectedLog)
  } else {
    // Normal editor mode - show current automation steps
    if (automation.definition.trigger) {
      blocks.push(automation.definition.trigger)
    }
    blocks = blocks.concat(automation.definition.steps || [])
  }
  return blocks
}

export const enrichLog = (
  definitions: BlockDefinitions,
  log: AutomationLog
) => {
  if (!definitions || !log || !log.steps) {
    return log
  }

  const enrichedLog = { ...log, steps: [...log.steps] }

  for (let step of enrichedLog.steps) {
    const trigger =
      definitions.TRIGGER?.[step.stepId as AutomationTriggerStepId]
    const action = definitions.ACTION[step.stepId as AutomationActionStepId]

    if (trigger || action) {
      step.icon = (trigger ? trigger.icon : action?.icon) || step.icon
      step.name = (trigger ? trigger.name : action?.name) || step.name
    }
  }
  return enrichedLog
}

export const summariseBranch = (branch: Branch) => {
  const groups = branch?.conditionUI?.groups || []
  if (groups.length === 0) return ""

  const filters = groups[0]?.filters || []
  if (filters.length === 0) return ""

  const { field, operator, value } = filters[0]
  let summary = `${field} ${operator} ${value}`

  if (filters.length > 1) {
    summary += ` and ${filters.length - 1} other condition${
      filters.length - 1 > 1 ? "s" : ""
    }`
  }
  return summary
}

export const getCurrentStepData = (step: AutomationStepResult) => {
  if (!step) return null

  return {
    inputs: step.inputs || {},
    outputs: step.outputs || {},
    errors: getStepErrors(step),
  }
}

export const getStepErrors = (step: AutomationStepResult) => {
  if (!step || step.outputs?.success !== false) return []

  return [
    {
      message: step.outputs?.message || "Step failed",
      type: "error",
    },
  ]
}

export const getBranchConditionDetails = (step: AutomationStepResult) => {
  if (!step || step.stepId !== AutomationActionStepId.BRANCH) return null

  const executedBranchId = step.outputs?.branchId
  const executedBranchName = step.outputs?.branchName
  const branches = step.inputs?.branches || []

  const executedBranch = branches.find(
    (branch: BranchStep) => branch.id === executedBranchId
  )

  return {
    executedBranchId,
    executedBranchName,
    executedBranch,
    allBranches: branches,
    totalBranches: branches.length,
  }
}
