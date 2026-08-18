import type {
  AnchorNodeData,
  BaseEdgeData,
  BranchEdgeData,
  FlowBlockContext,
  FlowBlockPath,
  LoopEdgeData,
  StepNodeData,
  AutomationBlock,
} from "@/types/automations"
import type { Edge as FlowEdge } from "@xyflow/svelte"
import type { BlockPath, Branch, BranchStep } from "@budibase/types"
import { ANCHOR, BRANCH, STEP } from "./FlowGeometry"
import {
  FLOW_NODE_TYPE,
  type AnchorFlowNode,
  type BranchFlowNode,
  type StepFlowNode,
} from "./FlowGraphTypes"

export const stepNode = (
  id: string,
  block: AutomationBlock,
  parentId?: string,
  position: { x: number; y: number } = { x: 0, y: 0 }
): StepFlowNode => {
  const data: StepNodeData = {
    block,
    layout: {
      width: STEP.width,
      height: STEP.height,
    },
  }
  const node: StepFlowNode = {
    id,
    type: FLOW_NODE_TYPE.STEP,
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
): BranchFlowNode => {
  const data = {
    block: step,
    branch,
    branchIdx,
    layout: {
      width: laneWidth || STEP.width,
      height: BRANCH.height,
    },
    ...(parentId ? { isSubflow: true } : {}),
    ...(laneWidth ? { laneWidth } : {}),
  }
  const node: BranchFlowNode = {
    id,
    type: FLOW_NODE_TYPE.BRANCH,
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
): AnchorFlowNode => {
  const data: AnchorNodeData = {
    layout: {
      width: ANCHOR.width,
      height: ANCHOR.height,
    },
  }
  const node: AnchorFlowNode = {
    id,
    type: FLOW_NODE_TYPE.ANCHOR,
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
    branchStepId?: string
    branchIdx?: number
    pathTo?: BlockPath[]
  }
): FlowEdge => {
  const data: LoopEdgeData = {
    block: ctx.block,
    loopStepId: ctx.loopStepId,
    loopChildInsertIndex: ctx.loopChildInsertIndex,
    insertIntoLoopV2: true,
    ...(ctx.branchStepId ? { branchStepId: ctx.branchStepId } : {}),
    ...(typeof ctx.branchIdx === "number" ? { branchIdx: ctx.branchIdx } : {}),
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
