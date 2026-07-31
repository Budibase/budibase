import { fireEvent, render, screen, waitFor } from "@testing-library/svelte"
import { SourceName, type KnowledgeSourceOption } from "@budibase/types"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({
  connectOperationSharePointSite: vi.fn(),
  fetchAgentKnowledgeSourceOptions: vi.fn(),
  fetchWorkspaceDeployment: vi.fn(),
  saveSharePointQuickDatasource: vi.fn(),
  settings: vi.fn(),
}))

vi.mock("@/stores/builder", () => ({
  datasources: {
    create: vi.fn(),
    save: vi.fn(),
  },
  workspaceDeploymentStore: {
    fetch: mocks.fetchWorkspaceDeployment,
  },
}))

vi.mock("@/stores/builder/sortedIntegrations", () => ({
  sortedIntegrations: {
    subscribe: (run: (_integrations: { name: SourceName }[]) => void) => {
      run([{ name: SourceName.REST }])
      return () => {}
    },
  },
}))

vi.mock("@/stores/bb", () => ({
  bb: {
    settings: mocks.settings,
  },
}))

vi.mock("@/stores/portal", () => ({
  agentsStore: {
    connectOperationSharePointSite: mocks.connectOperationSharePointSite,
    fetchAgentKnowledgeSourceOptions: mocks.fetchAgentKnowledgeSourceOptions,
  },
  knowledgeConnectionsStore: {
    subscribe: (
      run: (_state: {
        connections: never[]
        sharePointDatasourceIds: never[]
      }) => void
    ) => {
      run({ connections: [], sharePointDatasourceIds: [] })
      return () => {}
    },
  },
}))

vi.mock("./sharePointQuickAdd", async importOriginal => ({
  ...(await importOriginal<typeof import("./sharePointQuickAdd")>()),
  saveSharePointQuickDatasource: mocks.saveSharePointQuickDatasource,
}))

import SelectSharePointSiteModal from "./SelectSharePointSiteModal.svelte"

const existingSite: KnowledgeSourceOption = {
  id: "existing-site",
  name: "Existing site",
  webUrl: "https://example.com/existing",
}

const availableSite: KnowledgeSourceOption = {
  id: "available-site",
  name: "Available site",
  webUrl: "https://example.com/available",
}

const submitQuickCredentials = async () => {
  const inputs = document.querySelectorAll<HTMLInputElement>(".fields input")
  await fireEvent.input(inputs[0], {
    target: { value: "tenant-id" },
  })
  await fireEvent.input(inputs[1], {
    target: { value: "client-id" },
  })
  await fireEvent.input(inputs[2], {
    target: { value: "client-secret" },
  })
  await fireEvent.click(screen.getByText("Connect"))
}

const connectQuickSharePoint = async (
  sites: KnowledgeSourceOption[],
  existingSiteIds = [existingSite.id]
) => {
  mocks.saveSharePointQuickDatasource.mockResolvedValue({
    _id: "datasource-id",
    type: "datasource",
    source: SourceName.REST,
  })
  mocks.fetchAgentKnowledgeSourceOptions.mockResolvedValue({ options: sites })

  const result = render(SelectSharePointSiteModal, {
    agentId: "agent-id",
    operationId: "operation-id",
    existingSiteIds,
  })
  await result.component.show()
  await submitQuickCredentials()

  return result
}

beforeEach(() => {
  vi.clearAllMocks()
  const modalContainer = document.createElement("div")
  modalContainer.classList.add("modal-container")
  document.body.appendChild(modalContainer)
})

afterEach(() => {
  document.querySelectorAll(".modal-container").forEach(element => {
    element.remove()
  })
})

describe("SelectSharePointSiteModal quick add", () => {
  it("opens the full SharePoint editor for advanced setup", async () => {
    const { component } = render(SelectSharePointSiteModal, {
      agentId: "agent-id",
      operationId: "operation-id",
    })
    await component.show()

    await fireEvent.click(await screen.findByText("Advanced setup"))

    expect(mocks.settings).toHaveBeenCalledWith(
      "/connections/apis/new/microsoft-sharepoint"
    )
    expect(screen.queryByText("Connect SharePoint")).not.toBeInTheDocument()
  })

  it("opens a saved quick datasource after site discovery fails", async () => {
    mocks.saveSharePointQuickDatasource.mockResolvedValue({
      _id: "datasource-id",
      type: "datasource",
      source: SourceName.REST,
    })
    mocks.fetchAgentKnowledgeSourceOptions.mockRejectedValue(
      new Error("Unable to fetch sites")
    )
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    try {
      const { component } = render(SelectSharePointSiteModal, {
        agentId: "agent-id",
        operationId: "operation-id",
      })
      await component.show()
      await submitQuickCredentials()
      await screen.findByText("Unable to fetch sites")

      await fireEvent.click(screen.getByText("Advanced setup"))

      expect(mocks.settings).toHaveBeenCalledWith(
        "/connections/apis/datasource-id"
      )
    } finally {
      errorSpy.mockRestore()
    }
  })

  it("selects the first site that has not already been added", async () => {
    await connectQuickSharePoint([existingSite, availableSite])

    await fireEvent.click(await screen.findByText("Sync all"))

    await waitFor(() => {
      expect(mocks.connectOperationSharePointSite).toHaveBeenCalledWith(
        "agent-id",
        "operation-id",
        expect.objectContaining({ site: availableSite })
      )
    })
  })

  it("explains when every returned site has already been added", async () => {
    await connectQuickSharePoint([existingSite])

    expect(
      await screen.findByText(
        "All SharePoint sites for this connection have already been added."
      )
    ).toBeInTheDocument()
    const selectiveSync = screen.getByRole("button", {
      name: "Selective sync",
    })
    const syncAll = screen.getByRole("button", { name: "Sync all" })
    expect(selectiveSync).toHaveClass("is-disabled")
    expect(syncAll).toHaveClass("is-disabled")
    await fireEvent.click(selectiveSync)
    await fireEvent.click(syncAll)
    expect(mocks.connectOperationSharePointSite).not.toHaveBeenCalled()
  })

  it("does not submit a selection that becomes excluded", async () => {
    const { rerender } = await connectQuickSharePoint([availableSite], [])
    await rerender({
      agentId: "agent-id",
      operationId: "operation-id",
      existingSiteIds: [availableSite.id],
    })

    await fireEvent.click(screen.getByRole("button", { name: "Sync all" }))

    expect(mocks.connectOperationSharePointSite).not.toHaveBeenCalled()
  })

  it("distinguishes a connection that returns no sites", async () => {
    await connectQuickSharePoint([])

    expect(
      await screen.findByText("No SharePoint sites found for this connection.")
    ).toBeInTheDocument()
  })
})
