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
  type BranchFlowContext,
  LoopV2NodeData,
} from "@/types/automations"

import { stepNode, anchorNode, edgeAddItem } from "./FlowCanvas/FlowFactories"
import type { GraphBuildDeps } from "./FlowCanvas/FlowGraphBuilder"
import {
  renderBranches,
  renderLoopV2Container,
} from "./FlowCanvas/FlowGraphBuilder"
import {
  ANCHOR,
  BRANCH,
  STEP,
  type FlowLayoutDirection,
} from "./FlowCanvas/FlowGeometry"
import { applyLoopClearance } from "./FlowCanvas/FlowLayout"

const FLOW_ITEM_CARD_HEIGHT = 60
const SWITCH_BRANCH_VERTICAL_SPACING = 140

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
          stepNode(baseId, block, undefined, {
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
        })
      )
    }

    if (!isBranchStep && (blocks.length === 1 || idx === blocks.length - 1)) {
      const terminalY = currentY + blockHeight
      const terminalId = `anchor-${baseId}`
      deps.newNodes.push(
        anchorNode(terminalId, undefined, {
          x: 0,
          y: terminalY,
        })
      )
      deps.newEdges.push(
        edgeAddItem(baseId, terminalId, {
          block,
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
  ranksep?: number
  nodesep?: number
  compactLoops?: boolean
  layoutDirection?: FlowLayoutDirection
}

export const dagreLayoutAutomation = (
  graph: { nodes: FlowNode[]; edges: FlowEdge[] },
  opts?: DagreLayoutOptions
) => {
  const rankdir = opts?.layoutDirection ?? "LR"
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
        const h = node?.data?.containerHeight
        if (h > 0) {
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

  alignSwitchBranchTargets(graph)

  if (compactLoops && rankdir === "LR") {
    applyLoopClearance(graph)
  }
  alignSwitchBranchTargets(graph)
  return graph
}

const isBranchFlowContext = (value: unknown): value is BranchFlowContext => {
  return (
    !!value &&
    typeof value === "object" &&
    "branchNode" in value &&
    value.branchNode === true
  )
}

const getNodeHeight = (node: FlowNode) => {
  if (node.type === "anchor-node") {
    return 0
  }
  if (isLoopSubflowNode(node)) {
    const height = node.data?.containerHeight
    return height > 0 ? height : STEP.height
  }
  return FLOW_ITEM_CARD_HEIGHT
}

interface SwitchBranchExtents {
  above: number
  below: number
}

const getNodeExtents = (node: FlowNode): SwitchBranchExtents => {
  const height = getNodeHeight(node)
  return {
    above: height / 2,
    below: height / 2,
  }
}

const getSwitchBranchTargetExtents = (
  node: FlowNode,
  nodesById: Record<string, FlowNode>,
  outgoingEdgesBySource: Record<string, FlowEdge[]>
): SwitchBranchExtents => {
  const branchEdges = (outgoingEdgesBySource[node.id] || []).filter(edge => {
    const block = edge.data?.block
    return isBranchFlowContext(block) && edge.source === block.branchStepId
  })

  const currentExtents = getNodeExtents(node)
  const branchFanoutExtents = branchEdges.length
    ? getSwitchBranchFanoutExtents(
        branchEdges,
        nodesById,
        outgoingEdgesBySource
      )
    : currentExtents
  const linearDescendantExtents = getLinearDescendantExtents(
    node,
    nodesById,
    outgoingEdgesBySource
  )

  return {
    above: Math.max(
      currentExtents.above,
      branchFanoutExtents.above,
      linearDescendantExtents.above
    ),
    below: Math.max(
      currentExtents.below,
      branchFanoutExtents.below,
      linearDescendantExtents.below
    ),
  }
}

const getLinearDescendantExtents = (
  node: FlowNode,
  nodesById: Record<string, FlowNode>,
  outgoingEdgesBySource: Record<string, FlowEdge[]>
): SwitchBranchExtents => {
  const outgoingEdges = outgoingEdgesBySource[node.id] || []
  const linearEdges = outgoingEdges.filter(
    edge => !isBranchFlowContext(edge.data?.block)
  )

  if (linearEdges.length !== 1) {
    return getNodeExtents(node)
  }

  const nextNode = nodesById[linearEdges[0].target]
  if (!nextNode || nextNode.parentId) {
    return getNodeExtents(node)
  }

  return getSwitchBranchTargetExtents(
    nextNode,
    nodesById,
    outgoingEdgesBySource
  )
}

const getSwitchBranchFanoutExtents = (
  branchEdges: FlowEdge[],
  nodesById: Record<string, FlowNode>,
  outgoingEdgesBySource: Record<string, FlowEdge[]>
): SwitchBranchExtents => {
  const sortedEdges = branchEdges.slice().sort((a, b) => {
    const aBlock = a.data?.block
    const bBlock = b.data?.block
    const aIdx = isBranchFlowContext(aBlock) ? aBlock.branchIdx : 0
    const bIdx = isBranchFlowContext(bBlock) ? bBlock.branchIdx : 0
    return aIdx - bIdx
  })
  const targetExtents = sortedEdges.map(edge => {
    const targetNode = nodesById[edge.target]
    return targetNode
      ? getSwitchBranchTargetExtents(
          targetNode,
          nodesById,
          outgoingEdgesBySource
        )
      : {
          above: FLOW_ITEM_CARD_HEIGHT / 2,
          below: FLOW_ITEM_CARD_HEIGHT / 2,
        }
  })
  const centers = getSwitchBranchTargetCenters(0, targetExtents)

  const extents = centers.reduce(
    (acc, center, idx) => {
      return {
        top: Math.min(acc.top, center - targetExtents[idx].above),
        bottom: Math.max(acc.bottom, center + targetExtents[idx].below),
      }
    },
    { top: 0, bottom: 0 }
  )

  return {
    above: Math.abs(extents.top),
    below: extents.bottom,
  }
}

const getSwitchBranchTargetCenters = (
  switchCenterY: number,
  targetExtents: SwitchBranchExtents[]
) => {
  const centers = Array(targetExtents.length).fill(0)

  if (targetExtents.length % 2 === 0) {
    const rightIdx = targetExtents.length / 2
    const leftIdx = rightIdx - 1
    centers[leftIdx] =
      -(targetExtents[leftIdx].below +
        SWITCH_BRANCH_VERTICAL_SPACING +
        targetExtents[rightIdx].above) /
      2
    centers[rightIdx] =
      (targetExtents[leftIdx].below +
        SWITCH_BRANCH_VERTICAL_SPACING +
        targetExtents[rightIdx].above) /
      2
  } else {
    centers[Math.floor(targetExtents.length / 2)] = 0
  }

  for (
    let idx = Math.floor((targetExtents.length - 1) / 2) - 1;
    idx >= 0;
    idx--
  ) {
    centers[idx] =
      centers[idx + 1] -
      targetExtents[idx + 1].above -
      SWITCH_BRANCH_VERTICAL_SPACING -
      targetExtents[idx].below
  }

  for (
    let idx = Math.ceil((targetExtents.length - 1) / 2) + 1;
    idx < targetExtents.length;
    idx++
  ) {
    centers[idx] =
      centers[idx - 1] +
      targetExtents[idx - 1].below +
      SWITCH_BRANCH_VERTICAL_SPACING +
      targetExtents[idx].above
  }

  return centers.map(center => switchCenterY + center)
}

const alignSwitchBranchTargets = (graph: {
  nodes: FlowNode[]
  edges: FlowEdge[]
}) => {
  const nodesById: Record<string, FlowNode> = {}
  graph.nodes.forEach(node => (nodesById[node.id] = node))
  const outgoingEdgesBySource = graph.edges.reduce<Record<string, FlowEdge[]>>(
    (acc, edge) => {
      ;(acc[edge.source] ||= []).push(edge)
      return acc
    },
    {}
  )

  const switchBranchEdges = graph.edges.filter(edge => {
    const block = edge.data?.block
    return (
      isBranchFlowContext(block) &&
      edge.source === block.branchStepId &&
      !!nodesById[edge.target]
    )
  })

  const edgesBySwitchId = switchBranchEdges.reduce<Record<string, FlowEdge[]>>(
    (acc, edge) => {
      const block = edge.data?.block
      if (isBranchFlowContext(block)) {
        ;(acc[block.branchStepId] ||= []).push(edge)
      }
      return acc
    },
    {}
  )

  Object.entries(edgesBySwitchId).forEach(([switchId, edges]) => {
    const switchNode = nodesById[switchId]
    if (!switchNode) {
      return
    }

    const sortedEdges = edges.slice().sort((a, b) => {
      const aBlock = a.data?.block
      const bBlock = b.data?.block
      const aIdx = isBranchFlowContext(aBlock) ? aBlock.branchIdx : 0
      const bIdx = isBranchFlowContext(bBlock) ? bBlock.branchIdx : 0
      return aIdx - bIdx
    })
    const switchCenterY = switchNode.position.y + FLOW_ITEM_CARD_HEIGHT / 2
    const targetExtents = sortedEdges.map(edge => {
      const targetNode = nodesById[edge.target]
      return targetNode
        ? getSwitchBranchTargetExtents(
            targetNode,
            nodesById,
            outgoingEdgesBySource
          )
        : {
            above: FLOW_ITEM_CARD_HEIGHT / 2,
            below: FLOW_ITEM_CARD_HEIGHT / 2,
          }
    })
    const targetCenters = getSwitchBranchTargetCenters(
      switchCenterY,
      targetExtents
    )

    sortedEdges.forEach((edge, idx) => {
      const targetNode = nodesById[edge.target]
      if (!targetNode) {
        return
      }
      targetNode.position = {
        ...targetNode.position,
        y: targetCenters[idx] - getNodeHeight(targetNode) / 2,
      }
      alignLinearBranchDescendants(
        targetNode.id,
        targetNode.position.y + getNodeHeight(targetNode) / 2,
        nodesById,
        outgoingEdgesBySource
      )
    })
  })
}

const alignLinearBranchDescendants = (
  startNodeId: string,
  centerY: number,
  nodesById: Record<string, FlowNode>,
  outgoingEdgesBySource: Record<string, FlowEdge[]>
) => {
  const visited = new Set<string>()
  let currentId: string | undefined = startNodeId

  while (currentId && !visited.has(currentId)) {
    visited.add(currentId)
    const outgoingEdges: FlowEdge[] = outgoingEdgesBySource[currentId] || []
    if (outgoingEdges.length !== 1) {
      return
    }

    const nextEdge: FlowEdge = outgoingEdges[0]
    if (isBranchFlowContext(nextEdge.data?.block)) {
      return
    }

    const nextNode: FlowNode | undefined = nodesById[nextEdge.target]
    if (!nextNode || nextNode.parentId) {
      return
    }

    nextNode.position = {
      ...nextNode.position,
      y: centerY - getNodeHeight(nextNode) / 2,
    }
    currentId = nextNode.id
  }
}

export type { GraphBuildDeps }
