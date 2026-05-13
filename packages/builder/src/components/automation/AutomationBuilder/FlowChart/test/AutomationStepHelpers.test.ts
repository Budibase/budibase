import { describe, it, vi } from "vitest"
import { writable } from "svelte/store"
import { AutomationActionStepId } from "@budibase/types"
import type { Edge, Node } from "@xyflow/svelte"
import {
  automationBlockDefinitions,
  automationLog,
  branchStep,
  nestedLoopBranchAutomation,
} from "@/test/automationFixtures"
import {
  dagreLayoutAutomation,
  getLogStepData,
  processLogSteps,
} from "../AutomationStepHelpers"

vi.mock("@/stores/builder", () => {
  return {
    automationStore: writable({
      blockDefinitions: {
        ACTION: {},
        TRIGGER: {},
      },
      selectedLog: undefined,
    }),
  }
})

describe("AutomationStepHelpers", () => {
  const nestedSwitchGraph = (
    middleNestedBranchesCount: number,
    bottomNestedBranchesCount = 0,
    bottomChainSwitchCount = 1
  ) => {
    const bottomSwitchIds = Array.from(
      { length: bottomNestedBranchesCount ? bottomChainSwitchCount : 0 },
      (_, idx) => `bottom-switch-${idx}`
    )
    const nodes: Node[] = [
      {
        id: "parent-switch",
        type: "step-node",
        data: {},
        position: { x: 0, y: 0 },
      },
      {
        id: "top-step",
        type: "step-node",
        data: {},
        position: { x: 0, y: 0 },
      },
      {
        id: "child-switch",
        type: "step-node",
        data: {},
        position: { x: 0, y: 0 },
      },
      {
        id: "bottom-anchor",
        type: "anchor-node",
        data: {},
        position: { x: 0, y: 0 },
      },
      {
        id: "bottom-step",
        type: "step-node",
        data: {},
        position: { x: 0, y: 0 },
      },
      ...(bottomNestedBranchesCount
        ? bottomSwitchIds.map(id => ({
            id,
            type: "step-node",
            data: {},
            position: { x: 0, y: 0 },
          }))
        : []),
      ...Array.from({ length: middleNestedBranchesCount }, (_, idx) => ({
        id: `nested-branch-${idx}`,
        type: "anchor-node",
        data: {},
        position: { x: 0, y: 0 },
      })),
      ...Array.from({ length: bottomNestedBranchesCount }, (_, idx) => ({
        id: `bottom-nested-branch-${idx}`,
        type: "anchor-node",
        data: {},
        position: { x: 0, y: 0 },
      })),
    ]
    const edges: Edge[] = [
      {
        id: "edge-parent-switch-top-step",
        type: "add-item",
        source: "parent-switch",
        target: "top-step",
        data: {
          block: {
            branchNode: true,
            branchStepId: "parent-switch",
            branchIdx: 0,
          },
        },
      },
      {
        id: "edge-parent-switch-child-switch",
        type: "add-item",
        source: "parent-switch",
        target: "child-switch",
        data: {
          block: {
            branchNode: true,
            branchStepId: "parent-switch",
            branchIdx: 1,
          },
        },
      },
      {
        id: "edge-parent-switch-bottom-anchor",
        type: "add-item",
        source: "parent-switch",
        target: "bottom-anchor",
        data: {
          block: {
            branchNode: true,
            branchStepId: "parent-switch",
            branchIdx: 2,
          },
        },
      },
      {
        id: "edge-bottom-anchor-bottom-step",
        type: "add-item",
        source: "bottom-anchor",
        target: "bottom-step",
        data: {
          block: {
            id: "bottom-anchor",
          },
        },
      },
      ...(bottomNestedBranchesCount
        ? [
            {
              id: "edge-bottom-step-bottom-switch-0",
              type: "add-item",
              source: "bottom-step",
              target: "bottom-switch-0",
              data: {
                block: {
                  id: "bottom-step",
                },
              },
            },
          ]
        : []),
      ...Array.from({ length: middleNestedBranchesCount }, (_, idx) => ({
        id: `edge-child-switch-nested-branch-${idx}`,
        type: "add-item",
        source: "child-switch",
        target: `nested-branch-${idx}`,
        data: {
          block: {
            branchNode: true,
            branchStepId: "child-switch",
            branchIdx: idx,
          },
        },
      })),
      ...Array.from({ length: bottomNestedBranchesCount }, (_, idx) => ({
        id: `edge-bottom-switch-bottom-nested-branch-${idx}`,
        type: "add-item",
        source: bottomSwitchIds[bottomSwitchIds.length - 1],
        target: `bottom-nested-branch-${idx}`,
        data: {
          block: {
            branchNode: true,
            branchStepId: bottomSwitchIds[bottomSwitchIds.length - 1],
            branchIdx: idx,
          },
        },
      })),
      ...bottomSwitchIds.slice(1).map((id, idx) => ({
        id: `edge-bottom-switch-${idx}-bottom-switch-${idx + 1}`,
        type: "add-item",
        source: `bottom-switch-${idx}`,
        target: id,
        data: {
          block: {
            branchNode: true,
            branchStepId: `bottom-switch-${idx}`,
            branchIdx: 2,
          },
        },
      })),
    ]
    return dagreLayoutAutomation({ nodes, edges }, { compactLoops: false })
  }

  it("keeps branch children when reconstructing loop log steps", () => {
    const { automation, branch } = nestedLoopBranchAutomation()
    const automationWithDefinitions = {
      ...automation,
      blockDefinitions: automationBlockDefinitions,
    }

    const blocks = processLogSteps(automationWithDefinitions, automationLog())
    const reconstructedLoop = blocks.find(block => block.id === "loop")

    expect(reconstructedLoop).toMatchObject({
      inputs: {
        children: [branch],
      },
    })
  })

  it("finds nested branch results stored under loop output items", () => {
    const branchResults = [
      {
        id: "branch",
        stepId: AutomationActionStepId.BRANCH,
        inputs: {},
        outputs: {
          branchId: "matched",
          branchName: "Matched",
        },
      },
      {
        id: "branch",
        stepId: AutomationActionStepId.BRANCH,
        inputs: {},
        outputs: {
          branchId: "fallback",
          branchName: "Fallback",
        },
      },
    ]
    const logData = automationLog({
      success: true,
      iterations: 2,
      items: {
        branch: branchResults,
      },
    })

    const result = getLogStepData(branchStep(), logData)

    expect(result?.outputs).toMatchObject({
      branchId: "fallback",
      branchName: "Fallback",
      iterations: 2,
      items: branchResults,
    })
  })

  it("increases parent switch split spacing for nested switch fanout", () => {
    const twoNestedBranchGraph = nestedSwitchGraph(2)
    const fourNestedBranchGraph = nestedSwitchGraph(4)

    const parentSwitch = fourNestedBranchGraph.nodes.find(
      node => node.id === "parent-switch"
    )
    const childSwitch = fourNestedBranchGraph.nodes.find(
      node => node.id === "child-switch"
    )
    const twoBranchBottom = twoNestedBranchGraph.nodes.find(
      node => node.id === "bottom-step"
    )
    const fourBranchBottom = fourNestedBranchGraph.nodes.find(
      node => node.id === "bottom-step"
    )

    expect(childSwitch?.position.y).toBe(parentSwitch?.position.y)
    expect(fourBranchBottom?.position.y).toBeGreaterThan(
      twoBranchBottom?.position.y || 0
    )
  })

  it("reserves parent switch split spacing for nested switches in linear branch paths", () => {
    const graph = nestedSwitchGraph(2, 5)

    const childSwitch = graph.nodes.find(node => node.id === "child-switch")
    const bottomSwitch = graph.nodes.find(node => node.id === "bottom-switch-0")

    expect(bottomSwitch?.position.y).toBeGreaterThan(
      (childSwitch?.position.y || 0) + 140
    )
  })

  it("reserves parent switch split spacing for repeated bottom-branch switches", () => {
    const graph = nestedSwitchGraph(2, 3, 4)

    const topStep = graph.nodes.find(node => node.id === "top-step")
    const bottomSwitch = graph.nodes.find(node => node.id === "bottom-switch-3")

    expect(bottomSwitch?.position.y).toBeGreaterThan(
      (topStep?.position.y || 0) + 420
    )
  })
})
