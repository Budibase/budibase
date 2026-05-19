import { FLOW_ITEM_ACTION_BAR_WIDTH } from "./FlowGeometry"

interface PrimaryBranchPathArgs {
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  preBranchLabelX: number
}

export const getPrimaryBranchPath = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  preBranchLabelX,
}: PrimaryBranchPathArgs) => {
  const actionBarHalfWidth = FLOW_ITEM_ACTION_BAR_WIDTH / 2
  const actionBarLeft = preBranchLabelX - actionBarHalfWidth
  const actionBarRight = preBranchLabelX + actionBarHalfWidth
  const radius = 12

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
