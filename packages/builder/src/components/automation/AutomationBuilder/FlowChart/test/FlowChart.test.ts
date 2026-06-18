import { render, waitFor } from "@testing-library/svelte"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { tick } from "svelte"
import { writable } from "svelte/store"
import MockSlot from "@/test/mocks/MockSlot.svelte"
import { automationWithSteps, serverLogStep } from "@/test/automationFixtures"
import { ViewMode } from "@/types/automations"
import { PublishResourceState } from "@budibase/types"

const mocks = vi.hoisted(() => {
  type StoreValue = Record<string, unknown>
  type MockNode = {
    id: string
    type: string
    data: { block: unknown }
    position: { x: number; y: number }
    width: number
    height: number
  }

  const store = <T>(initial: T) => {
    let value = initial
    const subscribers = new Set<(value: T) => void>()
    return {
      set: (next: T) => {
        value = next
        subscribers.forEach(run => run(value))
      },
      subscribe: (run: (value: T) => void) => {
        subscribers.add(run)
        run(value)
        return () => subscribers.delete(run)
      },
      update: (updater: (value: T) => T) => {
        value = updater(value)
        subscribers.forEach(run => run(value))
      },
    }
  }

  return {
    viewport: { x: 0, y: 0, zoom: 1 },
    mockNodes: [] as MockNode[],
    setViewport: vi.fn((viewport: { x: number; y: number; zoom: number }) => {
      mocks.viewport = viewport
    }),
    automationStore: store<StoreValue>({
      actionPanelBlock: undefined,
      blockDefinitions: { ACTION: {}, TRIGGER: {} },
      selectedBranchNode: undefined,
      selectedLog: undefined,
      selectedLogStepData: undefined,
      selectedNodeId: undefined,
      showLogDetailsPanel: false,
      showLogsPanel: false,
      showTestModal: false,
      testResults: undefined,
      viewMode: "editor",
    }),
    contextMenuStore: {
      subscribe: (run: (value: { visible: boolean }) => void) => {
        run({ visible: false })
        return () => {}
      },
      close: vi.fn(),
    },
    deploymentStore: { publishApp: vi.fn() },
    environment: { loadVariables: vi.fn() },
    selectedAutomation: store<unknown>({
      data: undefined,
      blockRefs: {},
    }),
    workspaceDeploymentStore: store<StoreValue>({ automations: {} }),
  }
})

Object.assign(mocks.automationStore, {
  actions: {
    addStickyNote: vi.fn(),
    closeActionPanel: vi.fn(),
    closeLogPanel: vi.fn(),
    closeLogsPanel: vi.fn(),
    getBlockByRef: vi.fn(),
    getLogs: vi.fn(() => Promise.resolve({ data: [] })),
    getToolbarFlowEndInsertion: vi.fn(),
    initAppSelf: vi.fn(),
    moveBlock: vi.fn(),
    openActionPanelToolbarFlowEnd: vi.fn(),
    openLogPanel: vi.fn(),
    openLogsPanel: vi.fn(),
    processBlockResults: vi.fn(),
    selectNode: vi.fn(),
    setViewMode: vi.fn(),
    toggleDisabled: vi.fn(),
  },
})

vi.mock("@/stores/builder", () => ({
  automationHistoryStore: {},
  automationStore: mocks.automationStore,
  contextMenuStore: mocks.contextMenuStore,
  deploymentStore: mocks.deploymentStore,
  selectedAutomation: mocks.selectedAutomation,
  workspaceDeploymentStore: mocks.workspaceDeploymentStore,
  MAX_STICKY_NOTES_PER_AUTOMATION: 10,
}))

vi.mock("@/stores/builder/automations", () => ({
  isNoOpBlockMove: () => false,
}))

vi.mock("@/stores/portal", () => ({
  environment: mocks.environment,
}))

vi.mock("@budibase/bbui", () => ({
  ActionButton: MockSlot,
  Modal: MockSlot,
  StatusLight: MockSlot,
  Switcher: MockSlot,
  notifications: { error: vi.fn() },
}))

vi.mock("@budibase/frontend-core", () => ({
  createAPIClient: () => ({}),
  memo: (value: unknown) => writable(value),
}))

vi.mock("@/components/common/LiveToggleButton.svelte", () => ({
  default: MockSlot,
}))

vi.mock("../Controls.svelte", () => ({
  default: MockSlot,
}))

vi.mock("../TestDataModal.svelte", () => ({
  default: MockSlot,
}))

vi.mock("../FlowCanvas/nodes/StickyNoteNode.svelte", () => ({
  default: MockSlot,
}))

vi.mock("@xyflow/svelte", () => ({
  SvelteFlow: MockSlot,
  Handle: MockSlot,
  Position: {
    Left: "left",
    Right: "right",
  },
  getViewportForBounds: vi.fn(),
  useSvelteFlow: () => ({
    getViewport: () => mocks.viewport,
    setViewport: mocks.setViewport,
    getNodes: () => mocks.mockNodes,
    getNodesBounds: () => ({ x: 0, y: 0, width: 0, height: 0 }),
  }),
}))

vi.mock("../AutomationStepHelpers", () => ({
  getBlocks: (automation: {
    definition: { trigger: unknown; steps: unknown[] }
  }) => [automation.definition.trigger, ...automation.definition.steps],
  buildTopLevelGraph: (
    _blocks: unknown[],
    deps: {
      newNodes: Array<{
        id: string
        type: string
        data: { block: unknown }
        position: { x: number; y: number }
        width: number
        height: number
      }>
    }
  ) => {
    deps.newNodes.push(
      {
        id: "trigger",
        type: "step-node",
        data: { block: _blocks[0] },
        position: { x: 0, y: 0 },
        width: 200,
        height: 120,
      },
      {
        id: "step-1",
        type: "step-node",
        data: { block: _blocks[1] },
        position: { x: 600, y: 0 },
        width: 200,
        height: 120,
      }
    )
  },
  dagreLayoutAutomation: <T>(graph: T) => graph,
}))

import FlowChart from "../FlowChart.svelte"

const rect = (
  x: number,
  y: number,
  width: number,
  height: number
): DOMRect => ({
  x,
  y,
  width,
  height,
  top: y,
  left: x,
  right: x + width,
  bottom: y + height,
  toJSON: () => ({}),
})

const setPaneSize = (width: number, height: number) => {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    function (this: HTMLElement) {
      return this.classList.contains("wrapper")
        ? rect(0, 0, width, height)
        : rect(0, height, 0, 0)
    }
  )
}

describe("FlowChart", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
    mocks.viewport = { x: 0, y: 0, zoom: 1 }
    mocks.mockNodes = []
    mocks.setViewport.mockClear()
    setPaneSize(1000, 600)
    global.ResizeObserver = class {
      observe = vi.fn()
      unobserve = vi.fn()
      disconnect = vi.fn()
    }

    const automation = automationWithSteps([serverLogStep("step-1")])
    mocks.selectedAutomation.set({
      data: automation,
      blockRefs: {
        trigger: { pathTo: [{ stepIdx: 0, id: "trigger" }] },
        "step-1": { pathTo: [{ stepIdx: 1, id: "step-1" }] },
      },
    })
    mocks.automationStore.set({
      actionPanelBlock: undefined,
      blockDefinitions: { ACTION: {}, TRIGGER: {} },
      selectedBranchNode: undefined,
      selectedLog: undefined,
      selectedLogStepData: undefined,
      selectedNodeId: undefined,
      showLogDetailsPanel: false,
      showLogsPanel: false,
      showTestModal: false,
      testResults: undefined,
      viewMode: ViewMode.EDITOR,
    })
  })

  it("does not add a side panel overlay offset when a selected step is already visible", async () => {
    const automation = {
      ...automationWithSteps([serverLogStep("step-1")]),
      _id: "automation-1",
      publishStatus: {
        published: false,
        name: "Automation",
        state: PublishResourceState.DISABLED,
      },
    }

    render(FlowChart, {
      props: { automation },
    })

    await waitFor(() => {
      expect(mocks.setViewport).toHaveBeenCalledWith(
        { x: 100, y: 240, zoom: 1 },
        { duration: 0 }
      )
    })
    mocks.setViewport.mockClear()

    mocks.automationStore.update(state => ({
      ...state,
      selectedNodeId: "step-1",
    }))

    await tick()
    expect(mocks.setViewport).not.toHaveBeenCalled()
  })

  it("moves the canvas left when opening the add-step panel would hide the target on the right", async () => {
    const automation = {
      ...automationWithSteps([serverLogStep("step-1")]),
      _id: "automation-1",
      publishStatus: {
        published: false,
        name: "Automation",
        state: PublishResourceState.DISABLED,
      },
    }

    render(FlowChart, {
      props: { automation },
    })

    await waitFor(() => {
      expect(mocks.setViewport).toHaveBeenCalledWith(
        { x: 100, y: 240, zoom: 1 },
        { duration: 0 }
      )
    })
    mocks.setViewport.mockClear()
    mocks.viewport = { x: 300, y: 240, zoom: 1 }

    mocks.automationStore.update(state => ({
      ...state,
      actionPanelBlock: { id: "step-1" },
    }))

    await waitFor(() => {
      expect(mocks.setViewport).toHaveBeenCalledWith(
        { x: -304, y: 240, zoom: 1 },
        { duration: 180 }
      )
    })
  })

  it("vertically pans when opening the add-step panel would hide the target vertically", async () => {
    const automation = {
      ...automationWithSteps([serverLogStep("step-1")]),
      _id: "automation-1",
      publishStatus: {
        published: false,
        name: "Automation",
        state: PublishResourceState.DISABLED,
      },
    }

    render(FlowChart, {
      props: { automation },
    })

    await waitFor(() => {
      expect(mocks.setViewport).toHaveBeenCalledWith(
        { x: 100, y: 240, zoom: 1 },
        { duration: 0 }
      )
    })
    mocks.setViewport.mockClear()
    mocks.viewport = { x: -305, y: 540, zoom: 1 }

    mocks.automationStore.update(state => ({
      ...state,
      actionPanelBlock: { id: "step-1" },
    }))

    await waitFor(() => {
      expect(mocks.setViewport).toHaveBeenCalledWith(
        { x: -305, y: 456, zoom: 1 },
        { duration: 180 }
      )
    })
  })
})
