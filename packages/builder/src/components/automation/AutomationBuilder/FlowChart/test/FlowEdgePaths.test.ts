import { describe, expect, it } from "vitest"
import { FLOW_ITEM_ACTION_BAR_WIDTH } from "../FlowCanvas/FlowGeometry"
import {
  getLoopEdgePath,
  getPrimaryBranchPath,
} from "../FlowCanvas/FlowEdgePaths"

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

describe("getPrimaryBranchPath", () => {
  it("routes same-row primary branch edges behind the action bar", () => {
    const sourceX = 200
    const sourceY = 120
    const preBranchLabelX = 300
    const targetX = 400
    const targetY = 120
    const path = getPrimaryBranchPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
      preBranchLabelX,
    })

    expect(path).toBe(
      [`M ${sourceX},${sourceY}`, `L ${targetX},${targetY}`].join(" ")
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

  it("routes offset primary branch edges behind the action bar", () => {
    const sourceX = 200
    const sourceY = 120
    const preBranchLabelX = 300
    const targetX = 420
    const targetY = 240
    const path = getPrimaryBranchPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
      preBranchLabelX,
    })

    expect(path).toContain(`L ${preBranchLabelX},${sourceY}`)
    expect(path).toContain(`Q ${preBranchLabelX},${targetY}`)
    expect(path).toContain(`L ${targetX},${targetY}`)
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
    const [branchPath] = getContinuousPathCommands(path)

    expect(branchPath[1]).toMatchObject({
      type: "L",
      x: preBranchLabelX,
      y: sourceY,
    })
    expect(branchPath[2]).toMatchObject({
      type: "L",
      x: preBranchLabelX,
    })
  })

  it("runs same-row primary branch horizontal lines behind the action bar", () => {
    const preBranchLabelX = 300
    const sourceX = 200
    const sourceY = 120
    const targetX = 420
    const path = getPrimaryBranchPath({
      sourceX,
      sourceY,
      targetX,
      targetY: sourceY,
      preBranchLabelX,
    })
    const [branchPath] = getContinuousPathCommands(path)

    expect(branchPath[0]).toMatchObject({
      type: "M",
      x: sourceX,
      y: sourceY,
    })
    expect(branchPath[1]).toMatchObject({
      type: "L",
      x: targetX,
      y: sourceY,
    })
  })
})

describe("getLoopEdgePath", () => {
  it("routes loop source edges through the action bar", () => {
    const sourceX = 570
    const sourceY = 206
    const targetX = 824
    const targetY = 177
    const labelX = 698
    const actionBarHalfWidth = FLOW_ITEM_ACTION_BAR_WIDTH / 2

    const path = getLoopEdgePath({
      sourceX,
      sourceY,
      targetX,
      targetY,
      labelX,
      side: "source",
    })
    const [sourcePath, targetPath] = getContinuousPathCommands(path)

    expect(sourcePath.at(-1)).toMatchObject({
      type: "L",
      x: labelX - actionBarHalfWidth,
      y: sourceY,
    })
    expect(targetPath[0]).toMatchObject({
      type: "M",
      x: labelX + actionBarHalfWidth,
      y: sourceY,
    })
  })

  it("keeps loop source edges orthogonal", () => {
    const path = getLoopEdgePath({
      sourceX: 570,
      sourceY: 206,
      targetX: 824,
      targetY: 177,
      labelX: 698,
      side: "source",
    })

    expectLineSegmentsToBeOrthogonal(path)
  })
})
