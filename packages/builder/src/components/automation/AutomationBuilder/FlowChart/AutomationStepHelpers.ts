import { get } from "svelte/store"
import { automationStore } from "@/stores/builder"

import type {
  Automation,
  AutomationLog,
  BlockDefinitions,
  Branch,
  BranchStep,
  AutomationStep,
  AutomationTrigger,
  AutomationStepResultInputs,
} from "@budibase/types"
import {
  AutomationActionStepId,
  AutomationTriggerStepId,
  type AutomationStepResult,
} from "@budibase/types"

import {
  ViewMode,
  type AutomationBlock,
  type AutomationLogStep,
} from "@/types/automations"

export { buildAutomationGraph } from "./FlowCanvas/buildAutomationGraph"

// -----------------
// Blocks / Logs API
// -----------------
type BranchChild = { id: string; [key: string]: unknown }

const getDefinitionChildren = (step: AutomationStep): AutomationStep[] => {
  if (step.stepId === AutomationActionStepId.BRANCH) {
    return Object.values(step.inputs?.children || {}).flat()
  }

  if (step.stepId === AutomationActionStepId.LOOP_V2) {
    return step.inputs?.children || []
  }

  return []
}

const findStep = (
  steps: AutomationStep[],
  id: string
): AutomationStep | undefined => {
  for (const step of steps) {
    if (step.id === id) {
      return step
    }

    const match = findStep(getDefinitionChildren(step), id)
    if (match) {
      return match
    }
  }
}

const getLogStepInputs = (
  definitionStep: AutomationStep | undefined,
  logStep: AutomationLogStep
): AutomationStepResultInputs => {
  if (!definitionStep) {
    return logStep.inputs || {}
  }

  if (
    definitionStep.stepId === AutomationActionStepId.BRANCH ||
    definitionStep.stepId === AutomationActionStepId.LOOP_V2
  ) {
    return {
      ...logStep.inputs,
      children: definitionStep.inputs.children,
    }
  }

  return logStep.inputs || {}
}

export const getBlocks = (automation: Automation, viewMode: ViewMode) => {
  const blockDefinitions = get(automationStore).blockDefinitions
  const selectedLog = get(automationStore).selectedLog
  let blocks: AutomationBlock[] = []

  if (viewMode === ViewMode.LOGS && selectedLog) {
    blocks = processLogSteps({ ...automation, blockDefinitions }, selectedLog)
  } else {
    if (automation.definition.trigger) {
      blocks.push(automation.definition.trigger)
    }
    blocks = blocks.concat(automation.definition.steps || [])
  }
  return blocks
}

export const processLogSteps = (
  automation: Automation & { blockDefinitions: BlockDefinitions },
  selectedLog: AutomationLog
) => {
  let blocks: AutomationBlock[] = []
  if (automation.definition.trigger) {
    blocks.push(automation.definition.trigger)
  }

  const branchChildStepIds = getBranchChildStepIds(selectedLog.steps)

  selectedLog.steps
    .filter(
      (logStep: AutomationLogStep) =>
        logStep.stepId !== automation.definition.trigger?.stepId
    )
    .filter((logStep: AutomationLogStep) => !branchChildStepIds.has(logStep.id))
    .forEach((logStep: AutomationLogStep) => {
      const definitionStep = findStep(
        automation.definition.steps || [],
        logStep.id
      )
      const stepDefinition = getStepDefinition(
        automation.blockDefinitions,
        logStep.stepId
      )
      blocks.push({
        ...definitionStep,
        ...logStep,
        inputs: getLogStepInputs(definitionStep, logStep),
        name: stepDefinition?.name || logStep.name || "",
        icon: stepDefinition?.icon || logStep.icon || "",
      })
    })
  return blocks
}

const getBranchChildStepIds = (steps: AutomationLogStep[]) => {
  const branchChildStepIds = new Set<string>()
  steps.forEach((logStep: AutomationLogStep) => {
    if (
      logStep.stepId === AutomationActionStepId.BRANCH &&
      logStep.outputs?.branchId
    ) {
      const executedBranchId = logStep.outputs.branchId
      const branchChildren = logStep.inputs.children?.[executedBranchId] || []

      branchChildren.forEach(
        (child: BranchChild & { blockToLoop?: string }) => {
          branchChildStepIds.add(child.id)
          if (child.blockToLoop) {
            branchChildStepIds.add(child.blockToLoop)
          }
        }
      )
    }
  })
  return branchChildStepIds
}

const getStepDefinition = (
  blockDefinitions: BlockDefinitions,
  stepId: string
) => {
  return (
    blockDefinitions?.ACTION?.[stepId as AutomationActionStepId] ||
    blockDefinitions?.TRIGGER?.[stepId as AutomationTriggerStepId]
  )
}

// Log enrichment functions
export const enrichLog = (
  definitions: BlockDefinitions,
  log: AutomationLog
): AutomationLog => {
  if (!definitions || !log || !log.steps) {
    return log
  }

  const enrichedLog = {
    ...log,
    steps: [...log.steps],
  } as AutomationLog
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

// Step data extraction functions
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

export const getLogStepData = (
  step: AutomationStep | AutomationTrigger,
  logData?: AutomationLog | null
) => {
  if (!logData) return null
  if (step.type === "TRIGGER") {
    return logData.trigger
  }

  const directLogStep = (logData.steps || []).find(
    logStep => logStep.id === step.id
  )
  if (directLogStep) {
    return directLogStep
  }

  for (const logStep of logData.steps || []) {
    const loopResults = logStep.outputs?.items?.[step.id]
    if (!Array.isArray(loopResults) || loopResults.length === 0) {
      continue
    }

    const latest = loopResults[loopResults.length - 1]
    return {
      ...latest,
      outputs: {
        ...latest.outputs,
        iterations: loopResults.length,
        items: loopResults,
      },
    }
  }

  return null
}

// Branch-specific functions
export const summariseBranch = (branch: Branch) => {
  const groups = branch?.conditionUI?.groups || []
  if (groups.length === 0) return ""

  const filters = groups[0]?.filters || []
  if (filters.length === 0) return ""

  const firstFilter = filters[0]
  if (!("field" in firstFilter)) {
    return ""
  }

  const { field, operator, value } = firstFilter
  let summary = `${field} ${operator} ${value}`

  if (filters.length > 1) {
    summary += ` and ${filters.length - 1} other condition${
      filters.length - 1 > 1 ? "s" : ""
    }`
  }
  return summary
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

export type { GraphBuildDeps } from "./FlowCanvas/FlowGraphTypes"
