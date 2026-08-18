import { fireEvent, render, screen, waitFor } from "@testing-library/svelte"
import { ToolExecutionPrincipal, type AgentOperation } from "@budibase/types"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { writable } from "svelte/store"
import MockBody from "@/test/mocks/MockBody.svelte"
import MockComponent from "@/test/mocks/MockComponent.svelte"
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
  Icon: MockComponent,
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
  default: MockComponent,
}))
vi.mock("../../GenerateInstructionsControl.svelte", () => ({
  default: MockComponent,
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
  isToolReferenced: () => false,
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
})
