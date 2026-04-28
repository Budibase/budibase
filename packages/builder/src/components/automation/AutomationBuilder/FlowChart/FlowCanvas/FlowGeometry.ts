export const NODE_SPACING = 100
export const DEFAULT_NODE_WIDTH = 90
export const DEFAULT_NODE_HEIGHT = 90

export const STEP = {
  width: 90,
  height: 90,
}

export const BRANCH = {
  height: 90,
}

export const ANCHOR = {
  width: 320,
  height: 1,
}

export const LOOP = {
  minHeight: 260,
  clearance: 100,
}

export const SUBFLOW = {
  laneWidth: 520,
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
