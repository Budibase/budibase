import { fireEvent, render, screen, waitFor } from "@testing-library/svelte"
import {
  AgentKnowledgeSourceType,
  SharePointScopeMode,
  type Agent,
} from "@budibase/types"
import { beforeEach, describe, expect, it, vi } from "vitest"
import MockBody from "@/test/mocks/MockBody.svelte"
import MockComponent from "@/test/mocks/MockComponent.svelte"
import MockControllableModal from "@/test/mocks/MockControllableModal.svelte"
import MockModalContent from "@/test/mocks/MockModalContent.svelte"
import MockSelect from "@/test/mocks/MockSelect.svelte"

const mocks = vi.hoisted(() => {
  const createStore = <T>(initialValue: T) => {
    let value = initialValue
    const subscribers = new Set<(value: T) => void>()

    return {
      subscribe(callback: (value: T) => void) {
        callback(value)
        subscribers.add(callback)
        return () => subscribers.delete(callback)
      },
      set(nextValue: T) {
        value = nextValue
        subscribers.forEach(callback => callback(value))
      },
    }
  }

  return {
    selectedAgent: createStore<Agent | undefined>(undefined),
    applyOperationSharePointSiteScope: vi.fn(),
    fetchAgentKnowledge: vi.fn(),
    fetchOperationKnowledgeSourceEntries: vi.fn(),
    fetchWorkspaceDeployment: vi.fn(),
    notifications: {
      error: vi.fn(),
      success: vi.fn(),
    },
  }
})

vi.mock("@budibase/bbui", () => ({
  ActionButton: MockBody,
  Body: MockBody,
  Modal: MockControllableModal,
  ModalContent: MockModalContent,
  RadioGroup: MockSelect,
  TreeView: MockBody,
  keepOpen: Symbol("keepOpen"),
  notifications: mocks.notifications,
}))

vi.mock("@/stores/portal", () => ({
  agentsStore: {
    applyOperationSharePointSiteScope: mocks.applyOperationSharePointSiteScope,
    fetchAgentKnowledge: mocks.fetchAgentKnowledge,
    fetchOperationKnowledgeSourceEntries:
      mocks.fetchOperationKnowledgeSourceEntries,
  },
  selectedAgent: mocks.selectedAgent,
}))

vi.mock("@/stores/builder", () => ({
  workspaceDeploymentStore: {
    fetch: mocks.fetchWorkspaceDeployment,
  },
}))

vi.mock("./tree/SharePointEntryTreeItem.svelte", () => ({
  default: MockComponent,
}))

import SelectSharePointFilesModal from "./SelectSharePointFilesModal.svelte"

const setSelectedAgent = (scopeMode: SharePointScopeMode) => {
  mocks.selectedAgent.set({
    _id: "agent-1",
    name: "Support",
    aiconfig: "default",
    operations: [
      {
        id: "operation-1",
        name: "Support operation",
        live: false,
        promptInstructions: "",
        allowKnowledgeSourceDownload: true,
        knowledgeSources: [
          {
            id: "source-1",
            type: AgentKnowledgeSourceType.SHAREPOINT,
            config: {
              datasourceId: "datasource-1",
              authConfigId: "auth-1",
              site: {
                id: "site-1",
                name: "Support site",
              },
              scope:
                scopeMode === SharePointScopeMode.ALL
                  ? { mode: SharePointScopeMode.ALL }
                  : {
                      mode: SharePointScopeMode.SELECTED,
                      targets: [],
                    },
            },
          },
        ],
      },
    ],
  })
}

const renderModal = async () => {
  const { component } = render(SelectSharePointFilesModal, {
    props: {
      agentId: "agent-1",
      operationId: "operation-1",
      siteId: "site-1",
    },
  })

  await component.show()
}

describe("SelectSharePointFilesModal", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.fetchOperationKnowledgeSourceEntries.mockResolvedValue({
      entries: [],
    })
  })

  it("does not save selected content without a target", async () => {
    setSelectedAgent(SharePointScopeMode.SELECTED)
    await renderModal()

    await fireEvent.click(screen.getByText("Save"))

    expect(mocks.notifications.error).toHaveBeenCalledWith(
      "Please select at least one file or list to sync"
    )
    expect(mocks.applyOperationSharePointSiteScope).not.toHaveBeenCalled()
    expect(screen.getByTestId("mock-modal")).toBeInTheDocument()
  })

  it("saves all content without explicit targets", async () => {
    setSelectedAgent(SharePointScopeMode.ALL)
    await renderModal()

    await fireEvent.click(screen.getByText("Save"))

    await waitFor(() => {
      expect(mocks.applyOperationSharePointSiteScope).toHaveBeenCalledWith(
        "agent-1",
        "operation-1",
        "site-1",
        {
          scope: {
            mode: SharePointScopeMode.ALL,
          },
        }
      )
    })
    expect(mocks.notifications.error).not.toHaveBeenCalled()
  })
})
