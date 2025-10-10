import { get } from "svelte/store"
import { automationStore } from "@/stores/builder"
import dagre from "@dagrejs/dagre"
import {
  Position,
  type Node as FlowNode,
  type Edge as FlowEdge,
} from "@xyflow/svelte"

import type {
  Automation,
  AutomationLog,
  BlockDefinitions,
  LayoutDirection,
  Branch,
  BranchStep,
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
  LoopV2NodeData,
} from "@/types/automations"

import { stepNode, anchorNode, edgeAddItem } from "./FlowCanvas/FlowFactories"
import type { GraphBuildDeps } from "./FlowCanvas/FlowGraphBuilder"
import {
  renderBranches,
  renderLoopV2Container,
} from "./FlowCanvas/FlowGraphBuilder"
import { ANCHOR, BRANCH, STEP } from "./FlowCanvas/FlowGeometry"
import { applyLoopClearance } from "./FlowCanvas/FlowLayout"

// -----------------
// Type Guards
// -----------------
type LoopSubflowNode = FlowNode<LoopV2NodeData, "loop-subflow-node">
const isLoopSubflowNode = (node: FlowNode): node is LoopSubflowNode => {
  return node.type === "loop-subflow-node"
}

// -----------------
// Blocks / Logs API
// -----------------
type BranchChild = { id: string; [key: string]: unknown }

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
      const stepDefinition = getStepDefinition(
        automation.blockDefinitions,
        logStep.stepId
      )
      blocks.push({
        ...logStep,
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

// Branch-specific functions
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

// ----------------------------
// Graph building (top-level)
// ----------------------------

export const buildTopLevelGraph = (
  blocks: AutomationBlock[],
  deps: GraphBuildDeps
) => {
  let currentY = 0

  blocks.forEach((block: AutomationBlock, idx: number) => {
    const isTrigger = idx === 0
    const isBranchStep = block.stepId === "BRANCH"
    const isLoopV2 = block.stepId === "LOOP_V2"
    const baseId = block.id
    let blockHeight = deps.ySpacing

    if (!isBranchStep) {
      if (isLoopV2 && "schema" in block) {
        const loopResult = renderLoopV2Container(block, 0, currentY, deps)
        blockHeight = loopResult.containerHeight
      } else {
        deps.newNodes.push(
          stepNode(baseId, block, deps.direction, undefined, {
            x: 0,
            y: currentY,
          })
        )
      }
    }

    if (!isTrigger && !isBranchStep) {
      const prevId = blocks[idx - 1].id
      deps.newEdges.push(
        edgeAddItem(prevId, baseId, {
          block: blocks[idx - 1],
          direction: deps.direction,
        })
      )
    }

    if (!isBranchStep && (blocks.length === 1 || idx === blocks.length - 1)) {
      const terminalY = currentY + blockHeight
      const terminalId = `anchor-${baseId}`
      deps.newNodes.push(
        anchorNode(terminalId, deps.direction, undefined, {
          x: 0,
          y: terminalY,
        })
      )
      deps.newEdges.push(
        edgeAddItem(baseId, terminalId, {
          block,
          direction: deps.direction,
        })
      )
    }

    if (isBranchStep) {
      const sourceForBranches = !isTrigger ? blocks[idx - 1].id : baseId
      const sourceBlock = !isTrigger ? blocks[idx - 1] : block
      const branchBottomY = renderBranches(
        block,
        sourceForBranches,
        sourceBlock,
        0,
        currentY + deps.ySpacing,
        deps
      )
      blockHeight = branchBottomY - currentY
    }

    currentY += blockHeight
  })
}

// ---------
// Layout
// ---------

export interface DagreLayoutOptions {
  rankdir?: LayoutDirection
  ranksep?: number
  nodesep?: number
  compactLoops?: boolean
}

export const dagreLayoutAutomation = (
  graph: { nodes: FlowNode[]; edges: FlowEdge[] },
  opts?: DagreLayoutOptions
) => {
  const rankdir = opts?.rankdir || "TB"
  const ranksep = opts?.ranksep ?? 260
  const nodesep = opts?.nodesep ?? 220
  const compactLoops = opts?.compactLoops !== false

  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))
  dagreGraph.setGraph({ rankdir, ranksep, nodesep })

  const nodeById: Record<string, FlowNode> = {}
  graph.nodes.forEach(n => (nodeById[n.id] = n))

  graph.nodes
    .filter(n => !n.parentId)
    .forEach(node => {
      let width = STEP.width
      let height = STEP.height
      if (node.type === "branch-node") {
        height = BRANCH.height
      } else if (node.type === "anchor-node") {
        width = ANCHOR.width
        height = ANCHOR.height
      } else if (isLoopSubflowNode(node)) {
        const w = node.data?.containerWidth
        if (w > 0) width = w
        // In horizontal (LR) layouts Dagre must know the vertical
        // length of the loop container so it can place rows correctly.
        const h = node?.data?.containerHeight
        const shouldUseHeight = rankdir === "LR" || !compactLoops
        if (shouldUseHeight && h > 0) {
          height = h
        }
      }
      dagreGraph.setNode(node.id, { width, height })
    })

  graph.edges
    .filter(e => {
      const s = nodeById[e.source]
      const t = nodeById[e.target]
      return !(s?.parentId || t?.parentId)
    })
    .forEach(edge => dagreGraph.setEdge(edge.source, edge.target))

  dagre.layout(dagreGraph)

  graph.nodes
    .filter(n => !n.parentId)
    .forEach(node => {
      const dims = dagreGraph.node(node.id)
      if (!dims) return
      const width = dims.width
      const height = dims.height
      if (rankdir === "LR") {
        node.targetPosition = Position.Left
        node.sourcePosition = Position.Right
      } else {
        node.targetPosition = Position.Top
        node.sourcePosition = Position.Bottom
      }
      node.position = {
        x: Math.round(dims.x - width / 2),
        y: Math.round(dims.y - height / 2),
      }
    })

  if (compactLoops) {
    applyLoopClearance(graph, rankdir)
  }
  return graph
}

export type { GraphBuildDeps }
