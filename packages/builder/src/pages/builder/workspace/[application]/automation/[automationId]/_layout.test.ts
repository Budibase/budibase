import { render, waitFor } from "@testing-library/svelte"
import { beforeEach, describe, expect, it, vi } from "vitest"
import MockSlot from "@/test/mocks/MockSlot.svelte"

const mocks = vi.hoisted(() => {
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

  const builderStore = store({ isResizingPanel: false })
  const automationStore = store({
    actionPanelBlock: undefined as unknown,
    automations: [{ _id: "automation-1" }],
    selectedNodeId: undefined as string | undefined,
    selectedBranchNode: undefined as unknown,
    showLogsPanel: false,
    showLogDetailsPanel: false,
    selectedLog: undefined as unknown,
  })
  const selectedAutomation = store({
    data: { _id: "automation-1", name: "Automation" },
    blockRefs: {},
  })

  return {
    builderStore,
    automationStore,
    selectedAutomation,
    selectResource: vi.fn(),
    closeActionPanel: vi.fn(),
    select: vi.fn(),
    resizeObserverCallback: undefined as ResizeObserverCallback | undefined,
  }
})

vi.mock("@roxi/routify", () => {
  const routeStore = {
    subscribe: (run: (value: undefined) => void) => {
      run(undefined)
      return () => {}
    },
  }
  return {
    goto: routeStore,
    params: routeStore,
    url: routeStore,
    redirect: routeStore,
    isActive: routeStore,
    page: routeStore,
    layout: routeStore,
  }
})

vi.mock("@/helpers/urlStateSync", () => ({
  syncURLToState: vi.fn(() => vi.fn()),
}))

vi.mock("@/stores/builder", () => ({
  builderStore: {
    subscribe: mocks.builderStore.subscribe,
    selectResource: mocks.selectResource,
  },
  automationStore: {
    subscribe: mocks.automationStore.subscribe,
    actions: {
      closeActionPanel: mocks.closeActionPanel,
      select: mocks.select,
    },
  },
  selectedAutomation: {
    subscribe: mocks.selectedAutomation.subscribe,
  },
}))

vi.mock("@/components/common/ResizablePanel.svelte", () => ({
  default: MockSlot,
}))

vi.mock("@/components/automation/AutomationBuilder/StepPanel.svelte", () => ({
  default: MockSlot,
}))

vi.mock(
  "@/components/automation/AutomationBuilder/FlowChart/SelectStepSidePanel.svelte",
  () => ({
    default: MockSlot,
  })
)

vi.mock("@/components/common/TopBar.svelte", () => ({
  default: MockSlot,
}))

vi.mock(
  "@/components/automation/AutomationBuilder/FlowChart/LogDetailsPanel.svelte",
  () => ({
    default: MockSlot,
  })
)

vi.mock(
  "@/components/automation/AutomationBuilder/FlowChart/AutomationLogsPanel.svelte",
  () => ({
    default: MockSlot,
  })
)

import AutomationLayout from "./_layout.svelte"

describe("Automation layout", () => {
  beforeEach(() => {
    localStorage.clear()
    mocks.builderStore.set({ isResizingPanel: false })
    mocks.automationStore.set({
      actionPanelBlock: undefined,
      automations: [{ _id: "automation-1" }],
      selectedNodeId: undefined,
      selectedBranchNode: undefined,
      showLogsPanel: false,
      showLogDetailsPanel: false,
      selectedLog: undefined,
    })
    mocks.selectedAutomation.set({
      data: { _id: "automation-1", name: "Automation" },
      blockRefs: {},
    })
    mocks.selectResource.mockClear()
    mocks.closeActionPanel.mockClear()
    mocks.select.mockClear()
    mocks.resizeObserverCallback = undefined
    global.ResizeObserver = class {
      constructor(callback: ResizeObserverCallback) {
        mocks.resizeObserverCallback = callback
      }
      observe = vi.fn()
      unobserve = vi.fn()
      disconnect = vi.fn()
    }
  })

  it("overlays the add-step panel and pushes automation header actions left", async () => {
    localStorage.setItem("automation-side-panel-width", "520")
    mocks.automationStore.set({
      actionPanelBlock: { id: "trigger" },
      automations: [{ _id: "automation-1" }],
      selectedNodeId: undefined,
      selectedBranchNode: undefined,
      showLogsPanel: false,
      showLogDetailsPanel: false,
      selectedLog: undefined,
    })

    const { container } = render(AutomationLayout)

    const actionPanel = container.querySelector(
      ".action-panel-container"
    ) as HTMLElement

    expect(actionPanel).toBeTruthy()
    expect(container.querySelector(".content")).toHaveClass(
      "action-panel-open"
    )
    await waitFor(() => {
      expect(
        (
          container.querySelector(".content") as HTMLElement
        ).style.getPropertyValue("--automation-action-panel-width")
      ).toBe("520px")
    })

    actionPanel.getBoundingClientRect = () =>
      ({
        width: 640,
      }) as DOMRect
    mocks.resizeObserverCallback?.([], {} as ResizeObserver)

    await waitFor(() => {
      expect(
        (
          container.querySelector(".content") as HTMLElement
        ).style.getPropertyValue("--automation-action-panel-width")
      ).toBe("640px")
    })
    expect(container.querySelector(".step-panel-container")).toBeFalsy()
  })

  it("keeps the selected-step settings panel in the side column", () => {
    mocks.automationStore.set({
      actionPanelBlock: undefined,
      automations: [{ _id: "automation-1" }],
      selectedNodeId: "step-1",
      selectedBranchNode: undefined,
      showLogsPanel: false,
      showLogDetailsPanel: false,
      selectedLog: undefined,
    })
    mocks.selectedAutomation.set({
      data: { _id: "automation-1", name: "Automation" },
      blockRefs: {
        "step-1": { pathTo: [{ stepIdx: 1, id: "step-1" }] },
      },
    })

    const { container } = render(AutomationLayout)

    expect(container.querySelector(".step-panel-container")).toBeTruthy()
    expect(container.querySelector(".action-panel-container")).toBeFalsy()
  })
})
