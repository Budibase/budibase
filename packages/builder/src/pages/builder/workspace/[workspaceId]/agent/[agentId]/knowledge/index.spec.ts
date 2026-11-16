import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/svelte"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { get } from "svelte/store"
import { KnowledgeBaseFileStatus } from "@budibase/types"
import { agentsStore } from "@/stores/portal"
import { workspaceDeploymentStore } from "@/stores/builder"
import Knowledge from "./index.svelte"
import { createKnowledgeFile, seedKnowledge } from "./testUtils"

const initialAgentState = get(agentsStore)

beforeEach(() => {
  vi.spyOn(agentsStore, "ensureOperationKnowledgeLoaded").mockResolvedValue()
})

afterEach(() => {
  cleanup()
  agentsStore.stopOperationKnowledgePolling()
  agentsStore.set(initialAgentState)
  vi.restoreAllMocks()
  document.body.replaceChildren()
})

const renderKnowledge = () => {
  const target = document.createElement("div")
  target.className = "spectrum modal-container"
  document.body.appendChild(target)
  return target
}

describe("Knowledge", () => {
  it("loads the selected SharePoint site's picker on the first Edit files click", async () => {
    const fetchEntries = vi
      .spyOn(agentsStore, "fetchOperationKnowledgeSourceEntries")
      .mockResolvedValue({ entries: [] })
    const operation = seedKnowledge()
    render(Knowledge, {
      target: renderKnowledge(),
      props: { operation, onUpdated: async () => true },
    })
    await fireEvent.click(
      screen.getByRole("button", { name: /Support site 2/ })
    )
    await fireEvent.click(
      await screen.findByRole("button", { name: "Edit files" })
    )

    await waitFor(() =>
      expect(fetchEntries).toHaveBeenCalledWith(
        "agent-1",
        "operation-1",
        "site-2"
      )
    )
  })

  it("refreshes deployment status after retrying a failed file", async () => {
    vi.spyOn(agentsStore, "retryOperationKnowledgeFile").mockResolvedValue()
    const refreshDeployment = vi
      .spyOn(workspaceDeploymentStore, "fetch")
      .mockResolvedValue()
    const operation = seedKnowledge({
      files: [
        { ...createKnowledgeFile(), status: KnowledgeBaseFileStatus.FAILED },
      ],
    })
    render(Knowledge, {
      target: renderKnowledge(),
      props: { operation, onUpdated: async () => true },
    })
    await fireEvent.click(
      screen.getByRole("button", { name: /support-policy.txt/ })
    )
    await fireEvent.click(await screen.findByRole("button", { name: /Retry$/ }))

    await waitFor(() => expect(refreshDeployment).toHaveBeenCalledOnce())
  })
})
