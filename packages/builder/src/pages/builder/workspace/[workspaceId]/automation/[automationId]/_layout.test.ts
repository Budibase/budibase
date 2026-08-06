import { fireEvent, render, waitFor } from "@testing-library/svelte"
import { beforeEach, describe, expect, it, vi } from "vitest"
import MockSlot from "@/test/mocks/MockSlot.svelte"

interface BuilderStoreState {
  isResizingPanel: boolean
}

interface AutomationStoreState {
  actionPanelBlock?: { id: string }
  automations: Array<{ _id: string }>
  selectedNodeId?: string
  selectedBranchNode?: { branchStepId: string }
  showLogsPanel: boolean
  showLogDetailsPanel: boolean
  selectedLog?: { _id: string }
}

interface BlockRef {
  pathTo: Array<{ stepIdx: number; id: string }>
}

interface SelectedAutomationState {
  data: { _id: string; name: string }
  blockRefs: Record<string, BlockRef>
}

type TestResizeObserverCallback = (entries: never[], observer: object) => void

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
        return () => {
          subscribers.delete(run)
        }
      },
      update: (updater: (value: T) => T) => {
        value = updater(value)
        subscribers.forEach(run => run(value))
      },
    }
  }

  const builderStore = store<BuilderStoreState>({ isResizingPanel: false })
  const automationStore = store<AutomationStoreState>({
    actionPanelBlock: undefined,
    automations: [{ _id: "automation-1" }],
    selectedNodeId: undefined,
    selectedBranchNode: undefined,
    showLogsPanel: false,
    showLogDetailsPanel: false,
    selectedLog: undefined,
  })
  const selectedAutomation = store<SelectedAutomationState>({
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
    resizeObserverCallback: undefined as TestResizeObserverCallback | undefined,
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
    setResizingPanel: (isResizingPanel: boolean) =>
      mocks.builderStore.update(state => ({ ...state, isResizingPanel })),
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
      constructor(callback: TestResizeObserverCallback) {
        mocks.resizeObserverCallback = callback
      }
      observe = vi.fn()
      unobserve = vi.fn()
      disconnect = vi.fn()
    } as typeof globalThis.ResizeObserver
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
    expect(container.querySelector(".content")).toHaveClass("panel-open")
    await waitFor(() => {
      expect(
        (
          container.querySelector(".content") as HTMLElement
        ).style.getPropertyValue("--automation-panel-width")
      ).toBe("520px")
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

  it("updates the automation header offset when the selected-step panel is resized", async () => {
    localStorage.setItem("automation-side-panel-width", "480")
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

    const { container, getByRole } = render(AutomationLayout)

    const panel = container.querySelector(".resizable-panel") as HTMLElement
    Object.defineProperty(panel, "clientWidth", {
      configurable: true,
      value: 480,
    })

    await waitFor(() => {
      expect(
        (
          container.querySelector(".content") as HTMLElement
        ).style.getPropertyValue("--automation-panel-width")
      ).toBe("480px")
    })

    await fireEvent.mouseDown(getByRole("separator"), {
      clientX: 480,
      pageX: 480,
      detail: 1,
    })
    await fireEvent.mouseMove(window, { clientX: 360, pageX: 360 })

    await waitFor(() => {
      expect(
        (
          container.querySelector(".content") as HTMLElement
        ).style.getPropertyValue("--automation-panel-width")
      ).toBe("600px")
    })

    await fireEvent.mouseUp(window, { clientX: 360, pageX: 360 })
  })
})
