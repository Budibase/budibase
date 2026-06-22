import { fireEvent, render, screen, waitFor } from "@testing-library/svelte"
import { beforeEach, describe, expect, it, vi } from "vitest"
import BlockData from "./BlockData.svelte"
import {
  AutomationActionStepId,
  AutomationStepType,
  AutomationTriggerStepId,
  type Automation,
  type AutomationStep,
} from "@budibase/types"
import { DataMode } from "@/types/automations"

const mocks = vi.hoisted(() => {
  const createStore = <T>(initial: T) => {
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

  const selectedAutomationNode = createStore<{
    nodeId?: string
    mode?: string
  }>({
    nodeId: "step1",
    mode: "data_in",
  })

  const syncSelectedAutomationNode = (state: {
    selectedNodeId?: string
    selectedNodeMode?: string
  }) => {
    selectedAutomationNode.update(current => {
      const next = {
        nodeId: state.selectedNodeId,
        mode: state.selectedNodeMode,
      }

      if (current.nodeId === next.nodeId && current.mode === next.mode) {
        return current
      }

      return next
    })
  }

  const automationStore = createStore({
    selectedNodeId: "step1",
    selectedNodeMode: "data_in",
    testResults: undefined,
    testProgress: {},
    blockDefinitions: {},
  })

  return {
    automationStore,
    selectedAutomationNode,
    syncSelectedAutomationNode,
    appStore: createStore({}),
    deploymentStore: createStore({}),
    permissions: createStore({}),
    selectedAutomation: createStore({
      blockRefs: {
        step1: {
          pathTo: [{ stepIdx: 1 }],
        },
      },
    }),
    tables: createStore({ list: [] }),
    workspaceDeploymentStore: createStore({ automations: {} }),
  }
})

Object.assign(mocks.automationStore, {
  actions: {
    getBlockByRef: vi.fn(),
    getPathSteps: vi.fn(() => []),
    processBlockResults: vi.fn(),
  },
})

vi.mock("@/stores/builder", () => ({
  appStore: mocks.appStore,
  automationStore: mocks.automationStore,
  deploymentStore: mocks.deploymentStore,
  permissions: mocks.permissions,
  selectedAutomation: mocks.selectedAutomation,
  selectedAutomationNode: mocks.selectedAutomationNode,
  tables: mocks.tables,
  workspaceDeploymentStore: mocks.workspaceDeploymentStore,
}))

vi.mock("@budibase/bbui", async () => {
  const { default: MockActionButton } = await import(
    "@/test/mocks/MockActionButton.svelte"
  )
  const { default: MockSlot } = await import("@/test/mocks/MockSlot.svelte")
  return {
    AbsTooltip: MockSlot,
    ActionButton: MockActionButton,
    Button: MockActionButton,
    Count: MockSlot,
    Divider: MockSlot,
    Helpers: { copyToClipboard: vi.fn(), uuid: vi.fn(() => "test-session") },
    Icon: MockSlot,
    notifications: { success: vi.fn() },
  }
})

vi.mock("@/components/common/JSONViewer.svelte", async () => ({
  default: (await import("@/test/mocks/MockSlot.svelte")).default,
}))

vi.mock("./AgentOutputViewer.svelte", async () => ({
  default: (await import("@/test/mocks/MockSlot.svelte")).default,
}))

const block: AutomationStep = {
  id: "step1",
  stepId: AutomationActionStepId.SERVER_LOG,
  type: AutomationStepType.ACTION,
  name: "Server log",
  tagline: "",
  icon: "",
  description: "",
  inputs: {
    text: "Log",
  },
  schema: {
    inputs: {
      required: [],
      properties: {},
    },
    outputs: {
      required: [],
      properties: {},
    },
  },
}

const automation: Automation = {
  _id: "auto1",
  appId: "app1",
  name: "Automation",
  definition: {
    trigger: {
      id: "trigger1",
      stepId: AutomationTriggerStepId.APP,
      type: AutomationStepType.TRIGGER,
      name: "App trigger",
      tagline: "",
      icon: "",
      description: "",
      inputs: {},
      schema: {
        inputs: {
          required: [],
          properties: {},
        },
        outputs: {
          required: [],
          properties: {},
        },
      },
    },
    steps: [block],
    stepNames: {},
  },
}

describe("BlockData", () => {
  beforeEach(() => {
    mocks.automationStore.set({
      selectedNodeId: "step1",
      selectedNodeMode: DataMode.INPUT,
      testResults: undefined,
      testProgress: {},
      blockDefinitions: {},
    })
    mocks.syncSelectedAutomationNode({
      selectedNodeId: "step1",
      selectedNodeMode: DataMode.INPUT,
    })
  })

  it("keeps the selected tab when automation progress refreshes", async () => {
    render(BlockData, {
      props: {
        context: undefined,
        block,
        automation,
      },
    })

    await fireEvent.click(screen.getByRole("button", { name: "Data Out" }))

    expect(screen.getByRole("button", { name: "Data Out" })).toHaveAttribute(
      "aria-pressed",
      "true"
    )

    mocks.automationStore.update(state => ({
      ...state,
      testProgress: {
        step1: {
          status: "running",
        },
      },
    }))

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Data Out" })).toHaveAttribute(
        "aria-pressed",
        "true"
      )
    })
    expect(screen.getByRole("button", { name: "Data In" })).toHaveAttribute(
      "aria-pressed",
      "false"
    )
  })
})
