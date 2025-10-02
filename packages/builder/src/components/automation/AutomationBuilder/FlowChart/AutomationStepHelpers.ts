import { get } from "svelte/store"
import { automationStore } from "@/stores/builder"
import {
  ViewMode,
  type AutomationBlock,
  type AutomationLogStep,
  type FlowBlockContext,
  type FlowBlockPath,
  type StepNodeData,
  type BranchNodeData,
  type LoopV2NodeData,
  type AnchorNodeData,
  type BaseEdgeData,
  type BranchEdgeData,
  type LoopEdgeData,
  BranchFlowContext,
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
  AutomationStep,
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
// Minimum gap after a loop container so the edge from the loop to the
// next node is clearly visible (prevents micro-edges)
const LOOP_CLEARANCE = 100

enum BranchMode {
  TOPLEVEL = "toplevel",
  SUBFLOW = "subflow",
}

interface LaneVisuals {
  laneWidth: number
  gap: number
  laneYSpacing: number
  anchorWidth: number
  containerWidth?: number
}

const computeLaneCenters = (
  count: number,
  mode: BranchMode,
  opts: {
    centerX?: number
    xSpacing?: number
    laneWidth?: number
    gap?: number
    containerWidth?: number
  }
) => {
  if (count <= 0) return [] as number[]
  if (mode === BranchMode.TOPLEVEL) {
    const { centerX = 0, xSpacing = 0 } = opts
    return Array.from({ length: count }, (_, i) =>
      Math.round(centerX + (i - (count - 1) / 2) * xSpacing)
    )
  }
  const laneWidth = opts.laneWidth || DEFAULT_NODE_WIDTH
  const gap = opts.gap || 40
  const totalWidth = count * laneWidth + Math.max(0, count - 1) * gap
  const left = Math.round(((opts.containerWidth || 0) - totalWidth) / 2)
  return Array.from({ length: count }, (_, i) =>
    Math.round(left + laneWidth / 2 + i * (laneWidth + gap))
  )
}

const pushBranchNode = (args: {
  id: string
  xCenter?: number
  xLeft?: number
  y: number
  branchIdx: number
  step: BranchStep
  branch: Branch
  parentId?: string
  direction?: LayoutDirection
  laneWidth?: number
  deps: GraphBuildDeps
}) => {
  const {
    id,
    xCenter,
    xLeft,
    y,
    branchIdx,
    step,
    branch,
    parentId,
    direction,
    laneWidth,
    deps,
  } = args
  const data: BranchNodeData = {
    block: step,
    branch,
    branchIdx,
    direction: direction || deps.direction,
  }
  const nodeBase: any = {
    id,
    type: "branch-node",
    data,
    position: { x: xLeft ?? 0, y },
  }
  if (typeof xCenter === "number") {
    // Top-level node uses ensurePosition with the fallback center
    const pos = deps.ensurePosition(id, { x: xCenter, y })
    nodeBase.position = pos
  } else if (typeof laneWidth === "number") {
    nodeBase.parentId = parentId
    nodeBase.extent = "parent"
    nodeBase.style = `width: ${laneWidth}px;`
  }
  deps.newNodes.push(nodeBase)
}

const pushAnchorNode = (args: {
  id: string
  xLeft: number
  y: number
  parentId?: string
  direction?: LayoutDirection
  deps: GraphBuildDeps
}) => {
  const { id, xLeft, y, parentId, direction, deps } = args
  const anchorNodeData: AnchorNodeData = {
    direction: direction || deps.direction,
  }
  deps.newNodes.push({
    id,
    type: "anchor-node",
    data: anchorNodeData,
    ...(parentId ? { parentId, extent: "parent" } : {}),
    position: { x: xLeft, y },
  })
}

interface PlaceBranchClusterArgs {
  step: BranchStep
  source: { id: string; block: FlowBlockContext; pathTo?: FlowBlockPath }
  coords: { centerX?: number; y: number }
  deps: GraphBuildDeps
  mode: BranchMode
  parentId?: string
  visuals: LaneVisuals
}

const placeBranchCluster = (args: PlaceBranchClusterArgs) => {
  const { step, source, coords, deps, mode, parentId, visuals } = args
  const baseId = step.id
  const branches: Branch[] = (step.inputs?.branches || []) as Branch[]
  const childrenMap: Record<string, AutomationStep[]> = (step.inputs
    ?.children || {}) as Record<string, AutomationStep[]>

  const centers = computeLaneCenters(branches.length, mode, {
    centerX: coords.centerX,
    xSpacing: deps.xSpacing,
    laneWidth: visuals.laneWidth,
    gap: visuals.gap,
    containerWidth: visuals.containerWidth,
  })

  let clusterBottomY =
    coords.y +
    (mode === BranchMode.TOPLEVEL ? deps.ySpacing : visuals.laneYSpacing)

  branches.forEach((branch, bIdx) => {
    const branchNodeId = `branch-${baseId}-${bIdx}-${branch.id}`

    if (mode === BranchMode.TOPLEVEL) {
      pushBranchNode({
        id: branchNodeId,
        xCenter: centers[bIdx],
        y: coords.y,
        branchIdx: bIdx,
        step,
        branch,
        direction: deps.direction,
        deps,
      })
    } else {
      const left = Math.round(centers[bIdx] - visuals.laneWidth / 2)
      pushBranchNode({
        id: branchNodeId,
        xLeft: left,
        y: coords.y,
        branchIdx: bIdx,
        step,
        branch,
        parentId,
        laneWidth: visuals.laneWidth,
        direction: deps.direction,
        deps,
      })
    }

    const edgeData: BranchEdgeData = {
      block: source.block,
      isBranchEdge: true,
      isPrimaryEdge: bIdx === Math.floor((branches.length - 1) / 2),
      branchStepId: baseId,
      branchIdx: bIdx,
      branchesCount: branches.length,
      direction: deps.direction,
      ...(source.pathTo ? { pathTo: source.pathTo } : {}),
    }
    deps.newEdges.push({
      id: `edge-${source.id}-${branchNodeId}`,
      type: "add-item",
      source: source.id,
      target: branchNodeId,
      data: edgeData,
    })

    // Build branch child context
    const parentPath = deps.blockRefs[baseId]?.pathTo || []
    const childSteps: AutomationStep[] = childrenMap?.[branch.id] || []
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

    if (mode === BranchMode.TOPLEVEL) {
      const chainResult =
        childSteps.length > 0
          ? renderChain(
              childSteps,
              branchNodeId,
              branchBlockRef,
              centers[bIdx],
              coords.y + deps.ySpacing,
              deps
            )
          : null

      let bottomY = coords.y + deps.ySpacing
      if (chainResult) {
        bottomY = chainResult.bottomY
      }
      // Terminal anchor when the branch chain doesn't introduce another branch
      if (!chainResult?.branched) {
        const terminalId = `anchor-${chainResult ? chainResult.lastNodeId : branchNodeId}`
        const terminalPos = deps.ensurePosition(terminalId, {
          x: centers[bIdx],
          y: bottomY,
        })
        pushAnchorNode({
          id: terminalId,
          xLeft: terminalPos.x,
          y: terminalPos.y,
          direction: deps.direction,
          deps,
        })
        const anchorEdgeData: BaseEdgeData = {
          block: chainResult ? chainResult.lastNodeBlock : branchBlockRef,
          direction: deps.direction,
        }
        deps.newEdges.push({
          id: `edge-${chainResult ? chainResult.lastNodeId : branchNodeId}-${terminalId}`,
          type: "add-item",
          source: chainResult ? chainResult.lastNodeId : branchNodeId,
          target: terminalId,
          data: anchorEdgeData,
        })
      }
      clusterBottomY = Math.max(
        clusterBottomY,
        (chainResult ? chainResult.bottomY : coords.y + deps.ySpacing) +
          deps.ySpacing
      )
    } else {
      // Subflow: render child chain within the lane and drop an anchor after it
      const left = Math.round(centers[bIdx] - visuals.laneWidth / 2)
      const stepWidth = 320
      const childLeft = Math.round(left + (visuals.laneWidth - stepWidth) / 2)

      const branchChildren: AutomationStep[] = childrenMap?.[branch.id] || []
      let laneY = coords.y + visuals.laneYSpacing
      let prevId: string = branchNodeId
      let prevBlock: FlowBlockContext = branchBlockRef

      branchChildren.forEach((child, idx) => {
        deps.newNodes.push({
          id: child.id,
          type: "step-node",
          data: {
            block: child,
            direction: deps.direction,
            isTopLevel: false,
          } as StepNodeData,
          parentId,
          extent: "parent",
          position: { x: childLeft, y: laneY },
        })

        const edgeData: BaseEdgeData = {
          block: prevBlock,
          direction: deps.direction,
        }
        deps.newEdges.push({
          id: `edge-${prevId}-${child.id}`,
          type: "add-item",
          source: prevId,
          target: child.id,
          data: edgeData,
        })

        prevId = child.id
        prevBlock = child
        laneY += 120 /*SUB_CHILD_HEIGHT*/ + 48 /*SUB_INTERNAL_SPACING*/
      })

      const anchorId = `anchor-${branchNodeId}`
      const anchorLeft = Math.round(
        left + (visuals.laneWidth - visuals.anchorWidth) / 2
      )
      const anchorY = laneY
      pushAnchorNode({
        id: anchorId,
        xLeft: anchorLeft,
        y: anchorY,
        parentId,
        direction: deps.direction,
        deps,
      })
      const anchorEdgeData: BaseEdgeData = {
        block: prevBlock,
        direction: deps.direction,
      }
      deps.newEdges.push({
        id: `edge-${prevId}-${anchorId}`,
        type: "add-item",
        source: prevId,
        target: anchorId,
        data: anchorEdgeData,
      })
      clusterBottomY = Math.max(clusterBottomY, anchorY + deps.ySpacing)
    }
  })

  return { bottomY: clusterBottomY, branched: true as const }
}

const buildLoopEdgeData = (
  sourceChild: AutomationBlock,
  loopStep: AutomationBlock,
  deps: GraphBuildDeps,
  insertIndex: number,
  pathTo?: BlockPath[]
): LoopEdgeData => {
  const blockContext: FlowBlockContext = {
    ...sourceChild,
    branchNode: false,
  }
  return {
    block: blockContext,
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
        // Keep real width so siblings don't overlap horizontally, but use a
        // small fixed height so Dagre doesn't inflate the whole rank.
        const w = node?.data?.containerWidth
        if (typeof w === "number" && w > 0) {
          width = w
        }
        // height intentionally left as DEFAULT_STEP_HEIGHT
      }
      dagreGraph.setNode(node.id, { width, height })
    })

  // Add edges (ignore edges that involve subflow children)
  graph.edges
    .filter(e => {
      const s = nodeById[e.source]
      const t = nodeById[e.target]
      const sIsChild = Boolean(s?.parentId)
      const tIsChild = Boolean(t?.parentId)
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

  // After layout, clear visual space only for the loop's own lane
  applyLoopClearance(graph, rankdir)

  return graph
}

// Keep Dagre ranks compact across branches by treating loops as short for layout,
// then only shifting the loop’s own downstream chain so it visually clears the
// container height/width. This avoids long edges in sibling lanes.
const applyLoopClearance = (
  graph: { nodes: FlowNode[]; edges: FlowEdge[] },
  rankdir: LayoutDirection
) => {
  const nodesById: Record<string, FlowNode> = {}
  graph.nodes.forEach(n => (nodesById[n.id] = n))

  // Top-level adjacency only
  const outgoing: Record<string, string[]> = {}
  for (const e of graph.edges) {
    const s = nodesById[e.source]
    const t = nodesById[e.target]
    if (!s || !t) continue
    if (s.parentId || t.parentId) continue
    ;(outgoing[e.source] ||= []).push(e.target)
  }

  const visited = new Set<string>()
  const shiftSubtree = (startId: string, delta: number, axis: "x" | "y") => {
    if (delta <= 0) return
    const stack = [startId]
    while (stack.length) {
      const id = stack.pop()!
      const node = nodesById[id]
      if (!node || node.parentId) continue
      const key = `${id}:${delta}:${axis}`
      if (visited.has(key)) continue
      visited.add(key)
      node.position =
        axis === "y"
          ? { x: node.position.x, y: node.position.y + delta }
          : { x: node.position.x + delta, y: node.position.y }
      const nexts = outgoing[id] || []
      for (const nId of nexts) stack.push(nId)
    }
  }

  for (const loopNode of graph.nodes) {
    if (loopNode.parentId || loopNode.type !== "loop-subflow-node") continue
    const nexts = outgoing[loopNode.id] || []
    if (rankdir === "LR") {
      const visualWidth =
        typeof loopNode?.data?.containerWidth === "number"
          ? loopNode.data.containerWidth
          : DEFAULT_NODE_WIDTH
      const right = loopNode.position.x + visualWidth + LOOP_CLEARANCE
      for (const targetId of nexts) {
        const target = nodesById[targetId]
        if (!target || target.parentId) continue
        const delta = right - target.position.x
        if (delta > 0) shiftSubtree(targetId, delta, "x")
      }
    } else {
      const visualHeight =
        typeof loopNode?.data?.containerHeight === "number"
          ? loopNode.data.containerHeight
          : DEFAULT_STEP_HEIGHT
      const bottom = loopNode.position.y + visualHeight + LOOP_CLEARANCE
      for (const targetId of nexts) {
        const target = nodesById[targetId]
        if (!target || target.parentId) continue
        const delta = bottom - target.position.y
        if (delta > 0) shiftSubtree(targetId, delta, "y")
      }
    }
  }
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
  const result = placeBranchCluster({
    step: branchStep as BranchStep,
    source: { id: sourceNodeId, block: sourceBlock },
    coords: { centerX, y: startY },
    deps,
    mode: BranchMode.TOPLEVEL,
    visuals: {
      laneWidth: DEFAULT_NODE_WIDTH,
      gap: deps.xSpacing,
      laneYSpacing: deps.ySpacing,
      anchorWidth: DEFAULT_NODE_WIDTH,
    },
  })
  return result.bottomY
}

export const renderLoopV2Container = (
  loopStep: LoopV2Step,
  x: number,
  y: number,
  deps: GraphBuildDeps
) => {
  const baseId = loopStep.id
  const children: AutomationStep[] = loopStep.inputs?.children || []

  const childHeight = 120
  const paddingTop = 90
  const paddingBottom = 90
  const internalSpacing = 48
  // Subflow branch lane sizing: pick a safe width that matches the
  // visual width of Branch nodes, plus a gap to avoid overlaps.
  // Match the visual width of Branch nodes in the UI to keep
  // spacing and centering exact. Adjust if design changes.
  const SUB_BRANCH_NODE_WIDTH = 520
  const SUB_BRANCH_GAP = 60
  const subXSpacing = SUB_BRANCH_NODE_WIDTH + SUB_BRANCH_GAP
  const subYSpacing = 240

  // Pre-compute container dimensions, accounting for branch fan-outs
  let containerWidth = 400
  let dynamicHeight = paddingTop
  let maxFanoutWidth = SUB_BRANCH_NODE_WIDTH
  for (const step of children) {
    if (step.stepId === AutomationActionStepId.BRANCH) {
      const branches: Branch[] = ((step as BranchStep)?.inputs?.branches ||
        []) as Branch[]
      const childrenMap: Record<string, AutomationStep[]> =
        (step as BranchStep)?.inputs?.children || {}
      const fanoutWidth =
        SUB_BRANCH_NODE_WIDTH + Math.max(0, branches.length - 1) * subXSpacing
      maxFanoutWidth = Math.max(maxFanoutWidth, fanoutWidth)
      const maxLaneChildren = branches.reduce((acc, br) => {
        const len = (childrenMap?.[br.id] || []).length
        return Math.max(acc, len)
      }, 0)
      dynamicHeight +=
        DEFAULT_BRANCH_HEIGHT +
        internalSpacing +
        maxLaneChildren * (childHeight + internalSpacing)
    } else {
      dynamicHeight += childHeight + internalSpacing
    }
  }
  dynamicHeight += paddingBottom
  containerWidth = Math.max(containerWidth, maxFanoutWidth + 80)
  const minContainerHeight = 260
  const containerHeight = Math.max(dynamicHeight, minContainerHeight)

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
  let lastLinearChild: AutomationStep | undefined = undefined
  children.forEach((child, cIdx) => {
    const isBranch = child.stepId === AutomationActionStepId.BRANCH
    if (!isBranch) {
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

      // Connect to previous linear child (if any)
      if (lastLinearChild) {
        const prevRef = deps.blockRefs?.[lastLinearChild.id]
        deps.newEdges.push({
          id: `loop-edge-${lastLinearChild.id}-${child.id}`,
          type: "add-item",
          source: lastLinearChild.id,
          target: child.id,
          data: buildLoopEdgeData(
            lastLinearChild,
            loopStep,
            deps,
            cIdx,
            prevRef?.pathTo
          ),
        })
      }
      lastLinearChild = child
      innerY += childHeight + internalSpacing
      return
    }

    // Render a branch fan-out inside the loop container via shared helper
    if (lastLinearChild) {
      const prevRef = deps.blockRefs?.[lastLinearChild.id]
      placeBranchCluster({
        step: child as BranchStep,
        source: {
          id: lastLinearChild.id,
          block: lastLinearChild,
          pathTo: prevRef?.pathTo,
        },
        coords: { y: innerY },
        deps,
        mode: BranchMode.SUBFLOW,
        parentId: baseId,
        visuals: {
          laneWidth: SUB_BRANCH_NODE_WIDTH,
          gap: SUB_BRANCH_GAP,
          laneYSpacing: subYSpacing,
          anchorWidth: 320,
          containerWidth,
        },
      })
    } else {
      placeBranchCluster({
        step: child as BranchStep,
        source: { id: child.id, block: child },
        coords: { y: innerY },
        deps,
        mode: BranchMode.SUBFLOW,
        parentId: baseId,
        visuals: {
          laneWidth: SUB_BRANCH_NODE_WIDTH,
          gap: SUB_BRANCH_GAP,
          laneYSpacing: subYSpacing,
          anchorWidth: 320,
          containerWidth,
        },
      })
    }

    // After a branch cluster we reset the linear chain context and advance Y
    lastLinearChild = undefined
    innerY += DEFAULT_BRANCH_HEIGHT + internalSpacing
  })

  // Add exit anchor only when last child is a non-branch linear item
  if (
    children.length > 0 &&
    children[children.length - 1].stepId !== AutomationActionStepId.BRANCH
  ) {
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
