import { get } from "svelte/store"
import { automationStore } from "@/stores/builder"
import {
  ViewMode,
  type AutomationBlock,
  type AutomationLogStep,
  type BranchFlowContext,
  type FlowBlockContext,
  type FlowBlockPath,
  type StepNodeData,
  type BranchNodeData,
  type LoopV2NodeData,
  type AnchorNodeData,
  type BaseEdgeData,
  type BranchEdgeData,
  type LoopEdgeData,
} from "@/types/automations"
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
  AutomationStepResult,
  AutomationTriggerResult,
  AutomationTriggerStepId,
  BlockDefinitions,
  BlockPath,
  BlockRef,
  Branch,
  BranchStep,
  LayoutDirection,
  LoopV2Step,
} from "@budibase/types"
import { Modal } from "@budibase/bbui"

type BranchChild = { id: string; [key: string]: unknown }

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
      branchChildren.forEach((child: BranchChild) => {
        branchChildStepIds.add(child.id)
      })
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
  blockRefs: Record<string, BlockRef>
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

const buildLoopEdgeData = (
  sourceChild: AutomationBlock,
  loopStep: AutomationBlock,
  deps: GraphBuildDeps,
  insertIndex: number,
  pathTo?: BlockPath[]
): LoopEdgeData => {
  return {
    block: sourceChild,
    direction: deps.direction,
    pathTo,
    loopStepId: loopStep.id,
    loopChildInsertIndex: insertIndex,
  }
}

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

  // Build a quick lookup for nodes
  const nodeById: Record<string, any> = {}
  graph.nodes.forEach(n => (nodeById[n.id] = n))

  // Add nodes with estimated sizes for layout, ignore subflow children
  graph.nodes
    .filter(n => !n.parentId)
    .forEach(node => {
      let width = DEFAULT_NODE_WIDTH
      let height = DEFAULT_STEP_HEIGHT
      if (node.type === "branch-node") {
        height = DEFAULT_BRANCH_HEIGHT
      } else if (node.type === "anchor-node") {
        width = DEFAULT_NODE_WIDTH
        height = 1
      } else if (node.type === "loop-subflow-node") {
        // Use the container dimensions passed in data for more accurate layout
        const w = node?.data?.containerWidth
        const h = node?.data?.containerHeight
        if (typeof w === "number" && w > 0) {
          width = w
        }
        if (typeof h === "number" && h > 0) {
          height = h
        }
      }
      dagreGraph.setNode(node.id, { width, height })
    })

  // Add edges (ignore edges that involve subflow children)
  graph.edges
    .filter(e => {
      const s = nodeById[e.source]
      const t = nodeById[e.target]
      const sIsChild = s?.parentNode || s?.parentId
      const tIsChild = t?.parentNode || t?.parentId
      return !sIsChild && !tIsChild
    })
    .forEach(edge => {
      dagreGraph.setEdge(edge.source, edge.target)
    })

  dagre.layout(dagreGraph)

  // Apply computed positions with sensible default handle positions based on orientation
  // First pass: place all nodes from dagre output
  graph.nodes
    .filter(n => !n.parentId)
    .forEach(node => {
      const dims = dagreGraph.node(node.id)
      if (!dims) return
      const width = dims.width
      const height = dims.height
      // Default handle positions based on rank direction
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

  return graph
}

export const renderChain = (
  chain: AutomationBlock[],
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
    const step = chain[i]
    const isBranch = step.stepId === AutomationActionStepId.BRANCH
    const isLoopV2 = step.stepId === AutomationActionStepId.LOOP_V2

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

    // Render Loop V2 as a subflow container with internal children
    if (isLoopV2) {
      const pos = deps.ensurePosition(step.id, { x: baseX, y: currentY })
      renderLoopV2Container(step as LoopV2Step, pos.x, pos.y, deps)

      const loopEntryEdgeData: BaseEdgeData = {
        block: lastNodeBlock,
        direction: deps.direction,
      }
      deps.newEdges.push({
        id: `edge-${lastNodeId}-${step.id}`,
        type: "add-item",
        source: lastNodeId,
        target: step.id,
        data: loopEntryEdgeData,
      })

      lastNodeId = step.id
      lastNodeBlock = step
      currentY += deps.ySpacing
      continue
    }

    const pos = deps.ensurePosition(step.id, { x: baseX, y: currentY })
    const nodeData: StepNodeData = {
      testDataModal: deps.testDataModal,
      block: step,
      direction: deps.direction,
    }
    deps.newNodes.push({
      id: step.id,
      type: "step-node",
      data: nodeData,
      position: pos,
    })
    const edgeData: BaseEdgeData = {
      block: lastNodeBlock,
      direction: deps.direction,
    }
    deps.newEdges.push({
      id: `edge-${lastNodeId}-${step.id}`,
      type: "add-item",
      source: lastNodeId,
      target: step.id,
      data: edgeData,
    })

    lastNodeId = step.id
    lastNodeBlock = step
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
  const children: Record<string, AutomationBlock[]> =
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

    const branchNodeData: BranchNodeData = {
      block: branchStep,
      branch,
      branchIdx: bIdx,
      direction: deps.direction,
    }
    deps.newNodes.push({
      id: branchNodeId,
      type: "branch-node",
      data: branchNodeData,
      position: branchPos,
    })

    const branchEdgeData: BranchEdgeData = {
      block: sourceBlock,
      isBranchEdge: true,
      isPrimaryEdge: bIdx === Math.floor((branches.length - 1) / 2),
      branchStepId: baseId,
      branchIdx: bIdx,
      branchesCount: branches.length,
      direction: deps.direction,
    }
    deps.newEdges.push({
      id: `edge-${sourceNodeId}-${branchNodeId}`,
      type: "add-item",
      source: sourceNodeId,
      target: branchNodeId,
      data: branchEdgeData,
    })

    // Children of this branch
    const parentPath = deps.blockRefs[baseId]?.pathTo || []
    const childSteps: AutomationBlock[] = children?.[branch.id] || []
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
      const anchorNodeData: AnchorNodeData = { direction: deps.direction }
      deps.newNodes.push({
        id: terminalId,
        type: "anchor-node",
        data: anchorNodeData,
        position: terminalPos,
      })
      const anchorEdgeData: BaseEdgeData = {
        block: lastNodeBlock,
        direction: deps.direction,
      }
      deps.newEdges.push({
        id: `edge-${lastNodeId}-${terminalId}`,
        type: "add-item",
        source: lastNodeId,
        target: terminalId,
        data: anchorEdgeData,
      })
    }

    clusterBottomY = Math.max(clusterBottomY, bottomY + deps.ySpacing)
  })

  return clusterBottomY
}

export const renderLoopV2Container = (
  loopStep: LoopV2Step,
  x: number,
  y: number,
  deps: GraphBuildDeps
) => {
  const baseId = loopStep.id
  const children: AutomationBlock[] = loopStep.inputs?.children || []
  // Compute container dimensions based on children count
  const childHeight = 120
  const paddingTop = 90
  const paddingBottom = 90
  const internalSpacing = 48
  const containerWidth = 400
  const childrenStackHeight =
    children.length > 0
      ? children.length * childHeight + (children.length - 1) * internalSpacing
      : 0
  const minContainerHeight = 260
  const containerHeight = Math.max(
    paddingTop + childrenStackHeight + paddingBottom,
    minContainerHeight
  )

  const loopNodeData: LoopV2NodeData = {
    block: loopStep,
    direction: deps.direction,
    containerHeight,
    containerWidth,
  }
  deps.newNodes.push({
    id: baseId,
    type: "loop-subflow-node",
    data: loopNodeData,
    selectable: false,
    draggable: false,
    style: `width: ${containerWidth}px; height: ${containerHeight}px;`,
    position: { x, y },
  })

  // Render children inside the container
  const stepWidth = 320
  const baseX = Math.max(0, Math.floor((containerWidth - stepWidth) / 2))
  let innerY = paddingTop
  children.forEach((child, cIdx) => {
    const childNodeData: StepNodeData = {
      block: child,
      isTopLevel: false,
      direction: deps.direction,
    }
    deps.newNodes.push({
      id: child.id,
      type: "step-node",
      data: childNodeData,
      parentId: baseId,
      extent: "parent",
      position: { x: baseX, y: innerY },
    })

    if (cIdx > 0) {
      const prevChild = children[cIdx - 1]
      const prevRef = deps.blockRefs?.[prevChild.id]
      deps.newEdges.push({
        id: `loop-edge-${prevChild.id}-${child.id}`,
        type: "add-item",
        source: prevChild.id,
        target: child.id,
        data: buildLoopEdgeData(
          prevChild,
          loopStep,
          deps,
          cIdx,
          prevRef?.pathTo
        ),
      })
    }

    innerY += childHeight + internalSpacing
  })

  if (children.length > 0) {
    const lastChild = children[children.length - 1]
    const lastRef = deps.blockRefs?.[lastChild.id]
    const exitAnchorId = `anchor-${baseId}-loop-${lastChild.id}`
    const exitAnchorData: AnchorNodeData = { direction: deps.direction }
    deps.newNodes.push({
      id: exitAnchorId,
      type: "anchor-node",
      data: exitAnchorData,
      parentId: baseId,
      extent: "parent",
      position: { x: baseX, y: innerY },
    })

    deps.newEdges.push({
      id: `loop-edge-${lastChild.id}-${exitAnchorId}`,
      type: "add-item",
      source: lastChild.id,
      target: exitAnchorId,
      data: buildLoopEdgeData(
        lastChild,
        loopStep,
        deps,
        children.length,
        lastRef?.pathTo
      ),
    })
  }

  return { containerWidth, containerHeight }
}

// Build entire top-level automation graph (trigger + steps + branches)
export const buildTopLevelGraph = (
  blocks: AutomationBlock[],
  deps: GraphBuildDeps
) => {
  blocks.forEach((block: any, idx: number) => {
    const isTrigger = idx === 0
    const isBranchStep = block.stepId === AutomationActionStepId.BRANCH
    const isLoopV2 = block.stepId === AutomationActionStepId.LOOP_V2
    const baseId = block.id
    const pos = deps.ensurePosition(baseId, { x: 0, y: idx * deps.ySpacing })

    if (!isBranchStep) {
      if (isLoopV2) {
        renderLoopV2Container(block, pos.x, pos.y, deps)
      } else {
        const stepNodeData: StepNodeData = {
          testDataModal: deps.testDataModal,
          block,
          isTopLevel: true,
          direction: deps.direction,
        }
        deps.newNodes.push({
          id: baseId,
          type: "step-node",
          data: stepNodeData,
          position: pos,
        })
      }
    }

    if (!isTrigger && !isBranchStep) {
      const prevId = blocks[idx - 1].id
      const topLevelEdgeData: BaseEdgeData = {
        block: blocks[idx - 1],
        direction: deps.direction,
      }
      deps.newEdges.push({
        id: `edge-${prevId}-${baseId}`,
        type: "add-item",
        source: prevId,
        target: baseId,
        data: topLevelEdgeData,
      })
    }

    if (!isBranchStep && (blocks.length === 1 || idx === blocks.length - 1)) {
      const terminalId = `anchor-${baseId}`
      const terminalPos = deps.ensurePosition(terminalId, {
        x: pos.x,
        y: pos.y + deps.ySpacing,
      })
      const terminalAnchorData: AnchorNodeData = { direction: deps.direction }
      deps.newNodes.push({
        id: terminalId,
        type: "anchor-node",
        data: terminalAnchorData,
        position: terminalPos,
      })

      const terminalEdgeData: BaseEdgeData = {
        block,
        direction: deps.direction,
      }
      deps.newEdges.push({
        id: `edge-${baseId}-${terminalId}`,
        type: "add-item",
        source: baseId,
        target: terminalId,
        data: terminalEdgeData,
      })
    }

    if (isBranchStep) {
      const sourceForBranches = !isTrigger ? blocks[idx - 1].id : baseId
      const sourceBlock = !isTrigger ? blocks[idx - 1] : block
      renderBranches(
        block,
        sourceForBranches,
        sourceBlock,
        pos.x,
        pos.y + deps.ySpacing,
        deps
      )
    }
  })
}
