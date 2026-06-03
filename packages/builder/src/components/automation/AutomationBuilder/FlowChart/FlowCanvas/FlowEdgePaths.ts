import { FLOW_ITEM_ACTION_BAR_WIDTH } from "./FlowGeometry"

interface LoopEdgePathArgs {
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  labelX: number
  side: "target" | "source" | "branch-source"
}

interface PrimaryBranchPathArgs {
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  preBranchLabelX: number
  splitPathAroundActionBar?: boolean
}

export const getPrimaryBranchPath = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  preBranchLabelX,
  splitPathAroundActionBar = true,
}: PrimaryBranchPathArgs) => {
  const actionBarHalfWidth = FLOW_ITEM_ACTION_BAR_WIDTH / 2
  const actionBarLeft = preBranchLabelX - actionBarHalfWidth
  const actionBarRight = preBranchLabelX + actionBarHalfWidth
  const radius = 12

  if (!splitPathAroundActionBar) {
    if (sourceY === targetY) {
      return [`M ${sourceX},${sourceY}`, `L ${targetX},${targetY}`].join(" ")
    }

    const yDirection = targetY > sourceY ? 1 : -1
    return [
      `M ${sourceX},${sourceY}`,
      `L ${preBranchLabelX},${sourceY}`,
      `L ${preBranchLabelX},${targetY - yDirection * radius}`,
      `Q ${preBranchLabelX},${targetY} ${preBranchLabelX + radius},${targetY}`,
      `L ${targetX},${targetY}`,
    ].join(" ")
  }

  if (sourceY === targetY) {
    return [
      `M ${sourceX},${sourceY}`,
      `L ${actionBarLeft},${sourceY}`,
      `M ${actionBarRight},${sourceY}`,
      `L ${targetX},${targetY}`,
    ].join(" ")
  }

  const yDirection = targetY > sourceY ? 1 : -1

  return [
    `M ${sourceX},${sourceY}`,
    `L ${actionBarLeft},${sourceY}`,
    `M ${preBranchLabelX},${sourceY}`,
    `L ${preBranchLabelX},${targetY - yDirection * radius}`,
    `Q ${preBranchLabelX},${targetY} ${preBranchLabelX + radius},${targetY}`,
    `L ${targetX},${targetY}`,
  ].join(" ")
}

export const getLoopEdgePath = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  labelX,
  side,
}: LoopEdgePathArgs) => {
  const radius = 12
  const actionBarHalfWidth = FLOW_ITEM_ACTION_BAR_WIDTH / 2
  const actionBarLeft = labelX - actionBarHalfWidth
  const actionBarRight = labelX + actionBarHalfWidth
  const desiredBendX = actionBarRight + radius
  const bendX = Math.max(
    sourceX + radius,
    Math.min(targetX - radius, desiredBendX)
  )
  const yDirection = targetY >= sourceY ? 1 : -1

  if (side === "source" || side === "branch-source") {
    if (Math.abs(targetY - sourceY) <= radius * 2) {
      return [
        `M ${sourceX},${sourceY}`,
        `L ${actionBarLeft},${sourceY}`,
        `M ${actionBarRight},${sourceY}`,
        `L ${targetX},${targetY}`,
      ].join(" ")
    }

    return [
      `M ${sourceX},${sourceY}`,
      `L ${actionBarLeft},${sourceY}`,
      `M ${actionBarRight},${sourceY}`,
      `L ${bendX - radius},${sourceY}`,
      `Q ${bendX},${sourceY} ${bendX},${sourceY + yDirection * radius}`,
      `L ${bendX},${targetY - yDirection * radius}`,
      `Q ${bendX},${targetY} ${bendX + radius},${targetY}`,
      `L ${targetX},${targetY}`,
    ].join(" ")
  }

  if (Math.abs(targetY - sourceY) <= radius * 2) {
    return [
      `M ${sourceX},${sourceY}`,
      `L ${bendX},${sourceY}`,
      `L ${bendX},${targetY}`,
      `L ${targetX},${targetY}`,
    ].join(" ")
  }

  return [
    `M ${sourceX},${sourceY}`,
    `L ${bendX - radius},${sourceY}`,
    `Q ${bendX},${sourceY} ${bendX},${sourceY + yDirection * radius}`,
    `L ${bendX},${targetY - yDirection * radius}`,
    `Q ${bendX},${targetY} ${bendX + radius},${targetY}`,
    `L ${targetX},${targetY}`,
  ].join(" ")
}
