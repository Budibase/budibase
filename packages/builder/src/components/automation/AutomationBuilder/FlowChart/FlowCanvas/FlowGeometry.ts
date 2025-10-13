import type { LayoutDirection } from "@budibase/types"

export const STEP = {
  width: 320,
  height: 100,
}

export const BRANCH = {
  height: 180,
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

export const defaultHandlePositions = (dir: LayoutDirection | undefined) => {
  const isLR = dir === "LR"
  return {
    sourcePosition: isLR ? "right" : "bottom",
    targetPosition: isLR ? "left" : "top",
  } as const
}
