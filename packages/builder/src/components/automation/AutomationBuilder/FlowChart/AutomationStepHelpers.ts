import { get } from "svelte/store"
import { automationStore } from "@/stores/builder"
import { ViewMode } from "@/types/automations"
import dagre from "@dagrejs/dagre"
import {
  Position,
  type Node as FlowNode,
  type Edge as FlowEdge,
} from "@xyflow/svelte"
import {
  Automation,
  AutomationActionStepId,
  AutomationLog,
  AutomationStep,
  AutomationStepResult,
  AutomationTrigger,
  AutomationTriggerResult,
  AutomationTriggerStepId,
  BlockDefinitions,
  BlockPath,
  BlockRef,
  Branch,
  BranchStep,
  LayoutDirection,
} from "@budibase/types"
import { Modal } from "@budibase/bbui"

type AutomationLogStep = AutomationTriggerResult | AutomationStepResult
type BranchChild = { id: string; [key: string]: unknown }
type ReconstructedBlock = AutomationLogStep & {
  name: string
  icon: string
}
export type AutomationBlock =
  | AutomationStep
  | AutomationTrigger
  | ReconstructedBlock

type AutomationBlockContext = AutomationBlock & { branchNode?: false }
type BranchPathEntry = Partial<BlockPath> & {
  branchIdx: number
  branchStepId: string
  stepIdx?: number
}
export type FlowBlockPath = Array<BlockPath | BranchPathEntry>
export interface BranchFlowContext {
  branchNode: true
  pathTo: FlowBlockPath
  branchIdx: number
  branchStepId: string
}
export type FlowBlockContext = AutomationBlockContext | BranchFlowContext

type AutomationBlockRef = BlockRef & {
  stepId?: string
  name?: string
  looped?: string
  blockToLoop?: string
  inputs?: Record<string, unknown>
}
export type AutomationBlockRefMap = Record<string, AutomationBlockRef>

const resolvePathTo = (
  context: FlowBlockContext | undefined,
  blockRefs: AutomationBlockRefMap
): FlowBlockPath | undefined => {
  if (!context) return undefined
  return context.branchNode
    ? context.pathTo
    : (blockRefs?.[context.id]?.pathTo as FlowBlockPath)
}

// Block processing and retrieval functions
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
  const branchChildStepIds = new Set()
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
    steps: [...log.steps] as [
      AutomationTriggerResult,
      ...AutomationStepResult[],
    ], // Steps array also contains a trigger as well as steps (??? this is a bad code smell that exists all across automations frontend)
  }

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

// Graph building helpers for SvelteFlow
export interface GraphBuildDeps {
  ensurePosition: (
    id: string,
    fallback: { x: number; y: number }
  ) => {
    x: number
    y: number
  }
  xSpacing: number
  ySpacing: number
  blockRefs: AutomationBlockRefMap
  testDataModal?: Modal
  newNodes: FlowNode[]
  newEdges: FlowEdge[]
  direction?: LayoutDirection
}

// Dagre layout for automation flow
export interface DagreLayoutOptions {
  rankdir?: LayoutDirection
  ranksep?: number
  nodesep?: number
}

const DEFAULT_NODE_WIDTH = 320
const DEFAULT_STEP_HEIGHT = 100
const DEFAULT_BRANCH_HEIGHT = 180

export const dagreLayoutAutomation = (
  graph: { nodes: FlowNode[]; edges: FlowEdge[] },
  opts?: DagreLayoutOptions
) => {
  const rankdir = opts?.rankdir || "TB"
  const ranksep = opts?.ranksep ?? 260
  const nodesep = opts?.nodesep ?? 220

  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))
  dagreGraph.setGraph({ rankdir, ranksep, nodesep })

  graph.nodes.forEach(node => {
    const width = DEFAULT_NODE_WIDTH
    let height = DEFAULT_STEP_HEIGHT
    if (node.type === "branch-node") {
      height = DEFAULT_BRANCH_HEIGHT
    } else if (node.type === "anchor-node") {
      height = 1
    }
    dagreGraph.setNode(node.id, { width, height })
  })

  graph.edges.forEach(edge => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  dagre.layout(dagreGraph)

  graph.nodes.forEach(node => {
    const dims = dagreGraph.node(node.id)
    if (!dims) return
    if (rankdir === "LR") {
      node.targetPosition = Position.Left
      node.sourcePosition = Position.Right
    } else {
      node.targetPosition = Position.Top
      node.sourcePosition = Position.Bottom
    }
    node.position = {
      x: Math.round(dims.x - dims.width / 2),
      y: Math.round(dims.y - dims.height / 2),
    }
  })

  return graph
}

export const renderChain = (
  chain: AutomationStep[],
  parentNodeId: string,
  parentBlock: FlowBlockContext,
  baseX: number,
  startY: number,
  deps: GraphBuildDeps
): {
  lastNodeId: string
  lastNodeBlock: FlowBlockContext
  bottomY: number
  branched: boolean
} => {
  let lastNodeId = parentNodeId
  let lastNodeBlock = parentBlock
  let currentY = startY
  let branched = false

  for (let i = 0; i < chain.length; i++) {
    let step = chain[i]
    const isBranch = step.stepId === AutomationActionStepId.BRANCH
    if (
      step.stepId === AutomationActionStepId.LOOP ||
      step.stepId === AutomationActionStepId.LOOP_V2
    ) {
      const targetId = step.blockToLoop
      const targetExistsInChain = chain.some(s => s.id === targetId)
      if (!targetId) {
        continue
      }
      if (targetExistsInChain) {
        continue
      }
      const targetRef = deps.blockRefs?.[targetId]
      if (!targetRef?.stepId) {
        continue
      }
      const definitions = get(automationStore).blockDefinitions
      const def = getStepDefinition(definitions, targetRef.stepId)
      step = {
        id: targetId,
        stepId: targetRef.stepId,
        type: "ACTION",
        name: targetRef.name || def?.name || "",
        icon: def?.icon || "",
        inputs: {},
      } as AutomationStep
    }

    if (isBranch) {
      const bottom = renderBranches(
        step,
        lastNodeId,
        lastNodeBlock,
        baseX,
        currentY,
        deps
      )
      return { lastNodeId, lastNodeBlock, bottomY: bottom, branched: true }
    }

    const definitions = get(automationStore).blockDefinitions
    const def = getStepDefinition(definitions, step.stepId)
    const stepForDisplay = {
      ...step,
      name: def?.name || step.name || "",
      icon: def?.icon || step.icon || "",
    } as AutomationStep

    const pos = deps.ensurePosition(step.id, { x: baseX, y: currentY })
    deps.newNodes.push({
      id: step.id,
      type: "step-node",
      data: {
        testDataModal: deps.testDataModal,
        block: stepForDisplay,
        direction: deps.direction,
      },
      position: pos,
    })
    deps.newEdges.push({
      id: `edge-${lastNodeId}-${step.id}`,
      type: "add-item",
      source: lastNodeId,
      target: step.id,
      data: {
        block: lastNodeBlock,
        direction: deps.direction,
        pathTo: resolvePathTo(lastNodeBlock, deps.blockRefs),
      },
    })

    lastNodeId = step.id
    lastNodeBlock = stepForDisplay
    currentY += deps.ySpacing
  }

  return { lastNodeId, lastNodeBlock, bottomY: currentY, branched }
}

export const renderBranches = (
  branchStep: AutomationBlock,
  sourceNodeId: string,
  sourceBlock: FlowBlockContext,
  centerX: number,
  startY: number,
  deps: GraphBuildDeps
): number => {
  const baseId = branchStep.id
  const branches: Branch[] = ((branchStep as BranchStep)?.inputs?.branches ||
    []) as Branch[]
  const children: Record<string, AutomationStep[]> =
    (branchStep as BranchStep)?.inputs?.children || {}

  let clusterBottomY = startY + deps.ySpacing // at least one row below

  branches.forEach((branch: Branch, bIdx: number) => {
    // Include the branch index in the node id so reordering updates positions
    const branchNodeId = `branch-${baseId}-${bIdx}-${branch.id}`
    const branchX = centerX + (bIdx - (branches.length - 1) / 2) * deps.xSpacing
    const branchPos = deps.ensurePosition(branchNodeId, {
      x: branchX,
      y: startY,
    })

    deps.newNodes.push({
      id: branchNodeId,
      type: "branch-node",
      data: {
        block: branchStep,
        branch,
        branchIdx: bIdx,
        direction: deps.direction,
      },
      position: branchPos,
    })

    deps.newEdges.push({
      id: `edge-${sourceNodeId}-${branchNodeId}`,
      type: "add-item",
      source: sourceNodeId,
      target: branchNodeId,
      data: {
        block: sourceBlock,
        isBranchEdge: true,
        isPrimaryEdge: bIdx === Math.floor((branches.length - 1) / 2),
        branchStepId: baseId,
        branchIdx: bIdx,
        branchesCount: branches.length,
        direction: deps.direction,
        pathTo: resolvePathTo(sourceBlock, deps.blockRefs),
      },
    })

    // Children of this branch
    const parentPath = deps.blockRefs[baseId]?.pathTo || []
    const childSteps: AutomationStep[] = children?.[branch.id] || []
    const branchPath: FlowBlockPath = [
      ...parentPath,
      {
        branchIdx: bIdx,
        branchStepId: baseId,
        stepIdx: childSteps.length - 1,
      },
    ]
    const branchBlockRef: BranchFlowContext = {
      branchNode: true,
      pathTo: branchPath,
      branchIdx: bIdx,
      branchStepId: baseId,
    }

    let lastNodeId = branchNodeId
    let lastNodeBlock: FlowBlockContext = branchBlockRef
    let bottomY = startY + deps.ySpacing

    const chainResult =
      childSteps.length > 0
        ? renderChain(
            childSteps,
            lastNodeId,
            lastNodeBlock,
            branchX,
            startY + deps.ySpacing,
            deps
          )
        : null

    if (chainResult) {
      lastNodeId = chainResult.lastNodeId
      lastNodeBlock = chainResult.lastNodeBlock
      bottomY = chainResult.bottomY
    }

    // Add a terminal anchor when the branch chain doesn't introduce another branch
    if (!chainResult?.branched) {
      const terminalId = `anchor-${lastNodeId}`
      const terminalPos = deps.ensurePosition(terminalId, {
        x: branchX,
        y: bottomY,
      })
      deps.newNodes.push({
        id: terminalId,
        type: "anchor-node",
        data: { direction: deps.direction },
        position: terminalPos,
      })
      deps.newEdges.push({
        id: `edge-${lastNodeId}-${terminalId}`,
        type: "add-item",
        source: lastNodeId,
        target: terminalId,
        data: {
          block: lastNodeBlock,
          direction: deps.direction,
          pathTo: resolvePathTo(lastNodeBlock, deps.blockRefs),
        },
      })
    }

    clusterBottomY = Math.max(clusterBottomY, bottomY + deps.ySpacing)
  })

  return clusterBottomY
}
