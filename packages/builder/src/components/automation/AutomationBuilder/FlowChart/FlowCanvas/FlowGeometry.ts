export const NODE_SPACING = 100
export const FLOW_ITEM_ACTION_BAR_WIDTH = 72
export const LOOP_INSERT_ACTION_OFFSET = FLOW_ITEM_ACTION_BAR_WIDTH + 56
export const BRANCH_LOOP_INSERT_ACTION_OFFSET = FLOW_ITEM_ACTION_BAR_WIDTH + 112
export const DEFAULT_NODE_WIDTH = 200
export const DEFAULT_NODE_HEIGHT = 120
export const FLOW_ITEM_MAX_WIDTH = 360

export const STEP = {
  width: FLOW_ITEM_MAX_WIDTH,
  height: 120,
}

export const BRANCH = {
  height: 120,
}

export const ANCHOR = {
  width: 320,
  height: 1,
}

export const LOOP = {
  minHeight: 260,
  clearance: LOOP_INSERT_ACTION_OFFSET * 2,
}

export const SUBFLOW = {
  laneWidth: 320,
  laneGap: 60,
  ySpacing: 240,
  childHeight: 120,
  paddingTop: 90,
  paddingBottom: 56,
  internalSpacing: 48,
  stepWidth: 320,
}

export const defaultHandlePositions = () => {
  return {
    sourcePosition: "right",
    targetPosition: "left",
  } as const
}
