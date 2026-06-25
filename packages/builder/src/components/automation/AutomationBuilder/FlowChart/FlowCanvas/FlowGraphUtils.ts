import {
  AutomationActionStepId,
  type AutomationStep,
  type LoopV2Step,
} from "@budibase/types"
import type { AutomationBlock } from "@/types/automations"
import type { FlowBlockContext, FlowBlockPath } from "@/types/automations"
import type { GraphLayoutDeps } from "./FlowGraphTypes"

export const filterLegacyLoops = (
  steps: AutomationStep[]
): AutomationStep[] => {
  return steps.filter(step => step.stepId !== AutomationActionStepId.LOOP)
}

export const isLoopV2Step = (step: AutomationBlock): step is LoopV2Step => {
  return step.stepId === AutomationActionStepId.LOOP_V2 && "schema" in step
}

export const resolveBlockPath = (
  block: FlowBlockContext | undefined,
  deps: GraphLayoutDeps
): FlowBlockPath | undefined => {
  if (!block) {
    return undefined
  }
  if ("branchNode" in block && block.branchNode) {
    return block.pathTo
  }
  const ref = block?.id ? deps.blockRefs?.[block.id] : undefined
  return (ref?.pathTo as FlowBlockPath | undefined) || undefined
}
