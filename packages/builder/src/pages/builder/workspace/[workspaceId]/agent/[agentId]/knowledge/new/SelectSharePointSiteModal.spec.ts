import { fireEvent, render, screen, waitFor } from "@testing-library/svelte"
import { SourceName, type KnowledgeSourceOption } from "@budibase/types"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({
  connectOperationSharePointSite: vi.fn(),
  fetchAgentKnowledgeSourceOptions: vi.fn(),
  fetchWorkspaceDeployment: vi.fn(),
  saveSharePointQuickDatasource: vi.fn(),
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
    settings: vi.fn(),
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

if (!Element.prototype.animate) {
  Element.prototype.animate = () => {
    const animation = Object.create(null) as Animation
    animation.cancel = () => {}
    Object.defineProperty(animation, "finished", {
      value: Promise.resolve(animation),
    })
    Object.defineProperty(animation, "onfinish", {
      set: (callback: Animation["onfinish"]) => {
        if (callback) {
          queueMicrotask(() =>
            callback.call(
              animation,
              new Event("finish") as AnimationPlaybackEvent
            )
          )
        }
      },
    })
    return animation
  }
}

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
