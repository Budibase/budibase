import { describe, expect, it } from "vitest"
import { FLOW_ITEM_ACTION_BAR_WIDTH } from "../FlowCanvas/FlowGeometry"
import { getPrimaryBranchPath } from "../FlowCanvas/FlowEdgePaths"

const expectLineSegmentsToBeOrthogonal = (path: string) => {
  const commands = [
    ...path.matchAll(
      /([ML]) ([\d.-]+),([\d.-]+)|Q ([\d.-]+),([\d.-]+) ([\d.-]+),([\d.-]+)/g
    ),
  ]
  let currentPoint: { x: number; y: number } | undefined

  for (const command of commands) {
    const [, type, rawX, rawY] = command
    if (!type) {
      currentPoint = { x: Number(command[6]), y: Number(command[7]) }
      continue
    }
    const x = Number(rawX)
    const y = Number(rawY)
    if (type === "M") {
      currentPoint = { x, y }
      continue
    }
    expect(type).toBe("L")
    expect(currentPoint).toBeDefined()
    expect(
      x === currentPoint!.x || y === currentPoint!.y,
      `Expected ${type} ${x},${y} to be horizontal or vertical from ${currentPoint!.x},${currentPoint!.y}`
    ).toBe(true)
    currentPoint = { x, y }
  }
}

const getPathSegments = (path: string) => {
  const commands = [
    ...path.matchAll(
      /([ML]) ([\d.-]+),([\d.-]+)|Q ([\d.-]+),([\d.-]+) ([\d.-]+),([\d.-]+)/g
    ),
  ]
  const segmentGroups: Array<Array<"horizontal" | "vertical">> = []
  let segments: Array<"horizontal" | "vertical"> = []
  let currentPoint: { x: number; y: number } | undefined

  for (const command of commands) {
    const [, type, rawX, rawY] = command
    if (!type) {
      currentPoint = { x: Number(command[6]), y: Number(command[7]) }
      continue
    }
    const point = { x: Number(rawX), y: Number(rawY) }
    if (type === "M") {
      if (segments.length) {
        segmentGroups.push(segments)
      }
      segments = []
      currentPoint = point
      continue
    }
    if (currentPoint) {
      segments.push(point.y === currentPoint.y ? "horizontal" : "vertical")
    }
    currentPoint = point
  }

  if (segments.length) {
    segmentGroups.push(segments)
  }

  return segmentGroups
}

const getContinuousPathCommands = (path: string) => {
  return path.split(" M ").map((group, idx) => {
    const normalized = idx === 0 ? group : `M ${group}`
    return [
      ...normalized.matchAll(
        /([ML]) ([\d.-]+),([\d.-]+)|Q ([\d.-]+),([\d.-]+) ([\d.-]+),([\d.-]+)/g
      ),
    ].map(command => {
      if (command[1]) {
        return {
          type: command[1],
          x: Number(command[2]),
          y: Number(command[3]),
        }
      }
      return {
        type: "Q",
        controlX: Number(command[4]),
        controlY: Number(command[5]),
        x: Number(command[6]),
        y: Number(command[7]),
      }
    })
  })
}

const expectNoSShapedSegments = (path: string) => {
  const segmentGroups = getPathSegments(path)

  for (const segments of segmentGroups) {
    for (let i = 0; i < segments.length - 2; i++) {
      expect(segments.slice(i, i + 3)).not.toEqual([
        "horizontal",
        "vertical",
        "horizontal",
      ])
    }
  }
}

describe("getPrimaryBranchPath", () => {
  it("resumes same-row primary branch edges from the right side of the action bar", () => {
    const sourceX = 200
    const sourceY = 120
    const preBranchLabelX = 300
    const targetX = 400
    const targetY = 120
    const actionBarHalfWidth = FLOW_ITEM_ACTION_BAR_WIDTH / 2

    const path = getPrimaryBranchPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
      preBranchLabelX,
    })

    expect(path).toBe(
      [
        `M ${sourceX},${sourceY}`,
        `L ${preBranchLabelX - actionBarHalfWidth},${sourceY}`,
        `M ${preBranchLabelX + actionBarHalfWidth},${sourceY}`,
        `L ${targetX},${targetY}`,
      ].join(" ")
    )
  })

  it("routes offset primary branch edges without diagonal segments", () => {
    const path = getPrimaryBranchPath({
      sourceX: 200,
      sourceY: 120,
      targetX: 420,
      targetY: 240,
      preBranchLabelX: 300,
    })

    expectLineSegmentsToBeOrthogonal(path)
  })

  it("does not route offset primary branch edges as S-shaped paths", () => {
    const path = getPrimaryBranchPath({
      sourceX: 200,
      sourceY: 120,
      targetX: 420,
      targetY: 240,
      preBranchLabelX: 300,
    })

    expectNoSShapedSegments(path)
  })

  it("starts offset primary branch vertical lines from the middle of the action bar", () => {
    const preBranchLabelX = 300
    const sourceY = 120
    const path = getPrimaryBranchPath({
      sourceX: 200,
      sourceY,
      targetX: 420,
      targetY: 240,
      preBranchLabelX,
    })
    const [, branchPath] = getContinuousPathCommands(path)

    expect(branchPath[0]).toMatchObject({
      type: "M",
      x: preBranchLabelX,
      y: sourceY,
    })
    expect(branchPath[1]).toMatchObject({
      type: "L",
      x: preBranchLabelX,
    })
  })

  it("starts same-row primary branch horizontal lines from the right edge of the action bar", () => {
    const preBranchLabelX = 300
    const sourceY = 120
    const actionBarRight = preBranchLabelX + FLOW_ITEM_ACTION_BAR_WIDTH / 2
    const path = getPrimaryBranchPath({
      sourceX: 200,
      sourceY,
      targetX: 420,
      targetY: sourceY,
      preBranchLabelX,
    })
    const [, branchPath] = getContinuousPathCommands(path)

    expect(branchPath[0]).toMatchObject({
      type: "M",
      x: actionBarRight,
      y: sourceY,
    })
    expect(branchPath[1]).toMatchObject({
      type: "L",
      y: sourceY,
    })
  })

  it("curves when changing from vertical to horizontal", () => {
    const path = getPrimaryBranchPath({
      sourceX: 200,
      sourceY: 120,
      targetX: 420,
      targetY: 240,
      preBranchLabelX: 300,
    })
    const [, branchPath] = getContinuousPathCommands(path)

    // Q: quadratic Bézier curve.
    expect(branchPath.some(command => command.type === "Q")).toBe(true)
  })
})
