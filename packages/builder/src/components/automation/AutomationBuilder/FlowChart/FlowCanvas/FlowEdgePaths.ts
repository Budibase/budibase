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
}

interface CustomEdgeLabelPositionArgs {
  baseLabelX: number
  baseLabelY: number
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  isAnchorTarget: boolean
  isLoopTarget: boolean
  isLoopSource: boolean
  isLoopInsertAnchor: boolean
  isBranchSource: boolean
  loopInsertActionOffset: number
  branchLoopInsertActionOffset: number
}

interface CustomEdgePathArgs {
  isAnchorTarget: boolean
  anchorPath: string
  loopTargetPath?: string
  loopSourcePath?: string
  primaryBranchPath?: string
  basePath: string
}

export const getCustomEdgeLabelPosition = ({
  baseLabelX,
  baseLabelY,
  sourceX,
  sourceY,
  targetX,
  targetY,
  isAnchorTarget,
  isLoopTarget,
  isLoopSource,
  isLoopInsertAnchor,
  isBranchSource,
  loopInsertActionOffset,
  branchLoopInsertActionOffset,
}: CustomEdgeLabelPositionArgs) => {
  let labelX = baseLabelX
  let labelY = baseLabelY

  if (isAnchorTarget || isLoopTarget || isLoopSource) {
    labelX = Math.round(((sourceX ?? 0) + (targetX ?? 0)) / 2)
    labelY = isLoopSource ? (targetY ?? 0) : (sourceY ?? 0)
  }
  if (isLoopSource) {
    labelX = sourceX + loopInsertActionOffset
    labelY = sourceY
  }
  if (isLoopInsertAnchor && !isBranchSource) {
    labelX = sourceX + loopInsertActionOffset
    labelY = sourceY
  }
  if (isLoopInsertAnchor && isBranchSource) {
    labelX = sourceX + branchLoopInsertActionOffset
    labelY = sourceY
  }

  return { labelX, labelY }
}

export const getCustomEdgePath = ({
  isAnchorTarget,
  anchorPath,
  loopTargetPath,
  loopSourcePath,
  primaryBranchPath,
  basePath,
}: CustomEdgePathArgs) => {
  if (isAnchorTarget) {
    return anchorPath
  }
  return loopTargetPath || loopSourcePath || primaryBranchPath || basePath
}

export const getPrimaryBranchPath = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  preBranchLabelX,
}: PrimaryBranchPathArgs) => {
  const radius = 12

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
