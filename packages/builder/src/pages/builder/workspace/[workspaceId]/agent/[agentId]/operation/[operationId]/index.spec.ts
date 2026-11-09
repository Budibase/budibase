import { fireEvent, render, screen, waitFor } from "@testing-library/svelte"
import { ToolExecutionPrincipal, type AgentOperation } from "@budibase/types"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { writable } from "svelte/store"
import MockBody from "@/test/mocks/MockBody.svelte"
import MockComponent from "@/test/mocks/MockComponent.svelte"
import MockModal from "@/test/mocks/MockModal.svelte"
import MockConfigureOperationToolModal from "./MockConfigureOperationToolModal.svelte"
import MockGenerateInstructionsControl from "./MockGenerateInstructionsControl.svelte"
import MockOperationCodeEditor from "./MockOperationCodeEditor.svelte"
import MockToolsDropdown from "./MockToolsDropdown.svelte"

const mocks = vi.hoisted(() => {
  const { writable } = require("svelte/store")
  const updateAgentOperation = vi.fn()
  const agentsStore = writable({
    toolsLoaded: true,
    tools: [],
  })
  return {
    updateAgentOperation,
    fetchDeployment: vi.fn(),
    agentsStore: Object.assign(agentsStore, { updateAgentOperation }),
    tool: {
      name: "update_row",
      runtimeBinding: "ta_inventory_update_row",
      readableBinding: "budibase.Inventory.update_row",
      readableName: "Inventory.Update Row",
      sourceType: "DATASOURCE_QUERY",
      sourceLabel: "Budibase",
      executionPolicy: {
        mode: "configurable",
        defaultPrincipal: "requester",
      },
    },
    requesterPrincipal: "requester",
    selectedAgent: writable({
      _id: "agent-1",
      _rev: "1",
      name: "Support agent",
      aiconfig: "config-1",
      operations: [
        {
          id: "operation-1",
          name: "Update inventory",
          live: false,
          promptInstructions: "{{}}",
          enabledTools: [],
          allowKnowledgeSourceDownload: false,
        },
      ],
    }),
  }
})

vi.mock("@budibase/bbui", () => ({
  Body: MockBody,
  Helpers: { uuid: vi.fn(() => "test-session-id") },
  Icon: MockComponent,
  Modal: MockModal,
  notifications: { error: vi.fn() },
}))

vi.mock("@/components/common/CodeEditor/CodeEditor.svelte", () => ({
  default: MockOperationCodeEditor,
}))

vi.mock("../../ToolsDropdown.svelte", () => ({
  default: MockToolsDropdown,
}))

vi.mock("@/components/common/TopBar.svelte", () => ({ default: MockComponent }))
vi.mock("@/components/common/ConfirmDialog.svelte", () => ({
  default: MockComponent,
}))
vi.mock("@/components/common/EscalationRecipients.svelte", () => ({
  default: MockComponent,
}))
vi.mock("@/components/common/LiveToggleButton.svelte", () => ({
  default: MockComponent,
}))
vi.mock("../../AgentTabList.svelte", () => ({ default: MockComponent }))
vi.mock("../../AgentUnpublishedChangesIndicator.svelte", () => ({
  default: MockComponent,
}))
vi.mock("../../ConfigureOperationToolModal.svelte", () => ({
  default: MockConfigureOperationToolModal,
}))
vi.mock("../../OperationApprovalPolicyModal.svelte", () => ({
  default: MockComponent,
}))
vi.mock("../../OperationApprovalRuleModal.svelte", () => ({
  default: MockComponent,
}))
vi.mock("../../GenerateInstructionsControl.svelte", () => ({
  default: MockGenerateInstructionsControl,
}))
vi.mock("../../knowledge/index.svelte", () => ({ default: MockComponent }))
vi.mock("../../OperationRailSectionHeader.svelte", () => ({
  default: MockComponent,
}))
vi.mock("../../ToolIcon.svelte", () => ({ default: MockComponent }))
vi.mock("../../WebSearchConfigModal.svelte", () => ({
  default: MockComponent,
}))

vi.mock("@/stores/builder", () => ({
  contextMenuStore: { open: vi.fn() },
  datasources: writable({ list: [] }),
  restTemplates: { get: vi.fn() },
  workspaceDeploymentStore: { fetch: mocks.fetchDeployment },
}))

vi.mock("@/stores/portal", () => ({
  agentsStore: mocks.agentsStore,
  aiConfigsStore: writable({ customConfigs: [] }),
  featureFlags: writable({}),
  selectedAgent: mocks.selectedAgent,
}))

vi.mock("@/stores/bb", () => ({
  bb: { settings: vi.fn() },
}))

vi.mock("@roxi/routify", () => ({
  goto: writable(vi.fn()),
  params: writable({ agentId: "agent-1", operationId: "operation-1" }),
}))

vi.mock("../../agentAvailableTools", () => ({
  buildBindingIcons: () => ({}),
  getAgentWebSearchConfig: () => undefined,
  isWebSearchConfigured: () => false,
  resolveAvailableAgentTools: () => [mocks.tool],
  toAgentPromptBindings: () => [],
}))

vi.mock("../../toolBindingUtils", () => ({
  getDefaultToolExecutionPrincipal: () => mocks.requesterPrincipal,
  isToolReferenced: ({
    prompt,
    tool,
  }: {
    prompt?: string
    tool: { readableBinding?: string }
  }) => !!tool.readableBinding && !!prompt?.includes(tool.readableBinding),
  normalizeConfiguredOperationTools: ({
    operation,
  }: {
    operation: AgentOperation
  }) => operation.enabledTools || [],
}))

import OperationPage from "./index.svelte"

describe("operation page tool autocomplete", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.tool.sourceType = "DATASOURCE_QUERY"
    mocks.updateAgentOperation.mockResolvedValue({ _rev: "2" })
  })

  it("configures and inserts an autocomplete tool in one update", async () => {
    render(OperationPage)

    await fireEvent.click(screen.getByText("Trigger add tool"))
    await fireEvent.click(await screen.findByText("Select tool"))

    await waitFor(() =>
      expect(mocks.updateAgentOperation).toHaveBeenCalledTimes(1)
    )
    expect(mocks.updateAgentOperation).toHaveBeenCalledWith(
      "agent-1",
      "operation-1",
      expect.objectContaining({
        promptInstructions: "{{ budibase.Inventory.update_row }}",
        enabledTools: [
          {
            toolName: "ta_inventory_update_row",
            executionPrincipal: ToolExecutionPrincipal.REQUESTER,
          },
        ],
      })
    )
  })

  it("configures tools referenced by generated instructions", async () => {
    render(OperationPage)

    await fireEvent.click(screen.getByText("Apply generated instructions"))

    await waitFor(() =>
      expect(mocks.updateAgentOperation).toHaveBeenCalledTimes(1)
    )
    expect(mocks.updateAgentOperation).toHaveBeenCalledWith(
      "agent-1",
      "operation-1",
      expect.objectContaining({
        promptInstructions: "Use {{ budibase.Inventory.update_row }}",
        enabledTools: [
          {
            toolName: "ta_inventory_update_row",
            executionPrincipal: ToolExecutionPrincipal.REQUESTER,
          },
        ],
      })
    )
  })
})

describe("operation instructions autosave", () => {
  const typeInstructions = async (text: string) => {
    await fireEvent.input(screen.getByLabelText("Operation instructions"), {
      target: { value: text },
    })
  }

  const dispatchBeforeUnload = () => {
    const event = new Event("beforeunload", { cancelable: true })
    window.dispatchEvent(event)
    return event
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    mocks.updateAgentOperation.mockResolvedValue({ _rev: "2" })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("saves once, five seconds after the last edit", async () => {
    render(OperationPage)

    await typeInstructions("Check stock")
    await vi.advanceTimersByTimeAsync(3000)
    await typeInstructions("Check stock levels")
    await vi.advanceTimersByTimeAsync(5000)

    expect(mocks.updateAgentOperation).toHaveBeenCalledTimes(1)
    expect(mocks.updateAgentOperation).toHaveBeenCalledWith(
      "agent-1",
      "operation-1",
      expect.objectContaining({ promptInstructions: "Check stock levels" })
    )
  })

  it("does not save before five seconds have passed", async () => {
    render(OperationPage)

    await typeInstructions("Check stock")
    await vi.advanceTimersByTimeAsync(4999)

    expect(mocks.updateAgentOperation).not.toHaveBeenCalled()
  })

  it("saves unsaved edits when leaving the page", async () => {
    const { unmount } = render(OperationPage)

    await typeInstructions("Check stock")
    unmount()
    await vi.advanceTimersByTimeAsync(0)

    expect(mocks.updateAgentOperation).toHaveBeenCalledTimes(1)
    expect(mocks.updateAgentOperation).toHaveBeenCalledWith(
      "agent-1",
      "operation-1",
      expect.objectContaining({ promptInstructions: "Check stock" })
    )
  })

  it("does not save again when leaving during a save of the same instructions", async () => {
    let resolveSave: (value: { _rev: string }) => void = () => {}
    mocks.updateAgentOperation.mockReturnValueOnce(
      new Promise(resolve => {
        resolveSave = resolve
      })
    )
    const { unmount } = render(OperationPage)

    await typeInstructions("Check stock")
    await vi.advanceTimersByTimeAsync(5000)
    unmount()
    resolveSave({ _rev: "2" })
    await vi.advanceTimersByTimeAsync(0)

    expect(mocks.updateAgentOperation).toHaveBeenCalledTimes(1)
  })

  it("saves immediately on blur without saving again later", async () => {
    render(OperationPage)

    await typeInstructions("Check stock")
    await fireEvent.blur(screen.getByLabelText("Operation instructions"))
    await vi.advanceTimersByTimeAsync(5000)

    expect(mocks.updateAgentOperation).toHaveBeenCalledTimes(1)
  })

  it("shows unsaved changes while waiting to save", async () => {
    render(OperationPage)

    await typeInstructions("Check stock")

    expect(screen.getByText("Unsaved changes")).toBeTruthy()
  })

  it("shows saving while the save is in flight", async () => {
    mocks.updateAgentOperation.mockReturnValue(new Promise(() => {}))
    render(OperationPage)

    await typeInstructions("Check stock")
    await vi.advanceTimersByTimeAsync(5000)

    expect(screen.getByText("Saving…")).toBeTruthy()
  })

  it("shows saved once the instructions are saved", async () => {
    render(OperationPage)

    await typeInstructions("Check stock")
    await vi.advanceTimersByTimeAsync(5000)

    expect(screen.getByText("Saved")).toBeTruthy()
  })

  it("shows failed to save when the save fails", async () => {
    mocks.updateAgentOperation.mockRejectedValue(new Error("Network error"))
    render(OperationPage)

    await typeInstructions("Check stock")
    await vi.advanceTimersByTimeAsync(5000)

    expect(screen.getByText("Failed to save")).toBeTruthy()
  })

  it("clears the failed status when reverting to the saved instructions", async () => {
    mocks.updateAgentOperation.mockRejectedValue(new Error("Network error"))
    render(OperationPage)

    await typeInstructions("Check stock")
    await vi.advanceTimersByTimeAsync(5000)
    await typeInstructions("{{}}")
    await vi.advanceTimersByTimeAsync(5000)

    expect(mocks.updateAgentOperation).toHaveBeenCalledTimes(1)
    expect(screen.queryByText("Failed to save")).toBeNull()
  })

  it("does not save edits that were reverted to the saved instructions", async () => {
    render(OperationPage)

    await typeInstructions("Check stock")
    await typeInstructions("{{}}")
    await vi.advanceTimersByTimeAsync(5000)

    expect(mocks.updateAgentOperation).not.toHaveBeenCalled()
  })

  it("saves the reverted instructions when reverting during a save", async () => {
    let resolveSave: (value: { _rev: string }) => void = () => {}
    mocks.updateAgentOperation.mockReturnValueOnce(
      new Promise(resolve => {
        resolveSave = resolve
      })
    )
    render(OperationPage)

    await typeInstructions("Check stock")
    await vi.advanceTimersByTimeAsync(5000)
    await typeInstructions("{{}}")
    resolveSave({ _rev: "2" })
    await vi.advanceTimersByTimeAsync(0)

    expect(mocks.updateAgentOperation).toHaveBeenCalledTimes(2)
    expect(mocks.updateAgentOperation).toHaveBeenLastCalledWith(
      "agent-1",
      "operation-1",
      expect.objectContaining({ promptInstructions: "{{}}" })
    )
  })

  it("saves a tool insertion once without a later autosave", async () => {
    render(OperationPage)

    await fireEvent.click(screen.getByText("Trigger add tool"))
    await vi.advanceTimersByTimeAsync(0)
    await fireEvent.click(screen.getByText("Select tool"))
    await vi.advanceTimersByTimeAsync(5000)

    expect(mocks.updateAgentOperation).toHaveBeenCalledTimes(1)
  })

  it("warns before unloading while there are unsaved edits", async () => {
    render(OperationPage)

    await typeInstructions("Check stock")

    expect(dispatchBeforeUnload().defaultPrevented).toBe(true)
  })

  it("does not warn before unloading once the edits are saved", async () => {
    render(OperationPage)

    await typeInstructions("Check stock")
    await vi.advanceTimersByTimeAsync(5000)

    expect(dispatchBeforeUnload().defaultPrevented).toBe(false)
  })
})
