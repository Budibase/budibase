import type {
  AnchorNodeData,
  BaseEdgeData,
  BranchEdgeData,
  FlowBlockContext,
  FlowBlockPath,
  LoopEdgeData,
  StepNodeData,
  StickyNoteNodeData,
  StickyNote,
  AutomationBlock,
} from "@/types/automations"
import type { Node as FlowNode, Edge as FlowEdge } from "@xyflow/svelte"
import type { BlockPath, Branch, BranchStep } from "@budibase/types"

export const stepNode = (
  id: string,
  block: AutomationBlock,
  parentId?: string,
  position: { x: number; y: number } = { x: 0, y: 0 }
): FlowNode => {
  const data: StepNodeData = { block }
  const node: FlowNode = {
    id,
    type: "step-node",
    data,
    position,
    draggable: false,
  }
  if (parentId) {
    node.parentId = parentId
    node.extent = "parent"
  }
  return node
}

export const branchNode = (
  id: string,
  step: BranchStep,
  branch: Branch,
  branchIdx: number,
  parentId?: string,
  laneWidth?: number,
  position: { x: number; y: number } = { x: 0, y: 0 }
): FlowNode => {
  const data = {
    block: step,
    branch,
    branchIdx,
    ...(parentId ? { isSubflow: true } : {}),
    ...(laneWidth ? { laneWidth } : {}),
  }
  const node: FlowNode = {
    id,
    type: "branch-node",
    data,
    position,
    draggable: false,
  }
  if (parentId) {
    node.parentId = parentId
    node.extent = "parent"
    if (laneWidth) node.style = `width: ${laneWidth}px;`
  }
  return node
}

export const anchorNode = (
  id: string,
  parentId?: string,
  position: { x: number; y: number } = { x: 0, y: 0 }
): FlowNode => {
  const data: AnchorNodeData = {}
  const node: FlowNode = {
    id,
    type: "anchor-node",
    data,
    position,
    draggable: false,
  }
  if (parentId) {
    node.parentId = parentId
    node.extent = "parent"
  }
  return node
}

export const stickyNoteNode = (
  note: StickyNote,
  position: { x: number; y: number } = { x: note.x, y: note.y }
): FlowNode => {
  const data: StickyNoteNodeData = { note }
  return {
    id: note.id,
    type: "sticky-note",
    data,
    position,
    draggable: false,
    selectable: false,
  }
}

export const edgeAddItem = (
  source: string,
  target: string,
  ctx: {
    block: FlowBlockContext
    pathTo?: FlowBlockPath
  }
): FlowEdge => {
  const data: BaseEdgeData = {
    block: ctx.block,
    ...(ctx.pathTo ? { pathTo: ctx.pathTo } : {}),
  }
  return {
    id: `edge-${source}-${target}`,
    type: "add-item",
    source,
    target,
    data,
  }
}

export const edgeBranchAddItem = (
  source: string,
  target: string,
  ctx: {
    block: FlowBlockContext
    branchStepId: string
    branchIdx: number
    branchesCount: number
    isPrimaryEdge: boolean
    pathTo?: FlowBlockPath
    isSubflowEdge?: boolean
    loopStepId?: string
    loopChildInsertIndex?: number
  }
): FlowEdge => {
  const data: BranchEdgeData = {
    isBranchEdge: true,
    isPrimaryEdge: ctx.isPrimaryEdge,
    branchStepId: ctx.branchStepId,
    branchIdx: ctx.branchIdx,
    branchesCount: ctx.branchesCount,
    block: ctx.block,
    ...(ctx.isSubflowEdge ? { isSubflowEdge: true } : {}),
    ...(ctx.pathTo ? { pathTo: ctx.pathTo } : {}),
    ...(ctx.loopStepId ? { loopStepId: ctx.loopStepId } : {}),
    ...(typeof ctx.loopChildInsertIndex === "number"
      ? { loopChildInsertIndex: ctx.loopChildInsertIndex }
      : {}),
  }
  return {
    id: `edge-${source}-${target}`,
    type: "add-item",
    source,
    target,
    data,
  }
}

export const edgeLoopAddItem = (
  source: string,
  target: string,
  ctx: {
    block: FlowBlockContext
    loopStepId: string
    loopChildInsertIndex: number
    pathTo?: BlockPath[]
  }
): FlowEdge => {
  const data: LoopEdgeData = {
    block: ctx.block,
    loopStepId: ctx.loopStepId,
    loopChildInsertIndex: ctx.loopChildInsertIndex,
    insertIntoLoopV2: true,
    ...(ctx.pathTo ? { pathTo: ctx.pathTo } : {}),
  }
  return {
    id: `edge-${source}-${target}`,
    type: "add-item",
    source,
    target,
    data,
  }
}
