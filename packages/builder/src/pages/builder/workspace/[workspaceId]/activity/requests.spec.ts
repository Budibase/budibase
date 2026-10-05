import { render, screen, waitFor } from "@testing-library/svelte"
import { beforeEach, describe, expect, it, vi } from "vitest"
import MockBody from "@/test/mocks/MockBody.svelte"
import MockComponent from "@/test/mocks/MockComponent.svelte"
import MockSelect from "@/test/mocks/MockSelect.svelte"
import ActivityRequests from "./requests.svelte"

const mocks = vi.hoisted(() => {
  const { writable } = require("svelte/store")
  return {
    fetchAgentRequests: vi.fn(),
    agentsStore: writable({ agents: [{ _id: "agent-1", name: "Support" }] }),
  }
})

vi.mock("@budibase/bbui", () => ({
  Body: MockBody,
  Pagination: MockComponent,
  Select: MockSelect,
  Table: MockComponent,
  notifications: { error: vi.fn() },
}))

vi.mock("@/api", () => ({
  API: { fetchAgentRequests: mocks.fetchAgentRequests },
}))

vi.mock("@/stores/portal", () => ({
  agentsStore: mocks.agentsStore,
}))

vi.mock("@/stores/portal/users", () => ({
  users: { get: vi.fn() },
}))

vi.mock("@/stores/builder", () => ({
  builderStore: { websocket: undefined },
}))

vi.mock("./ActivitySidePanel.svelte", () => ({ default: MockComponent }))

describe("Activity requests page", () => {
  beforeEach(() => {
    mocks.fetchAgentRequests.mockReset()
    mocks.fetchAgentRequests.mockResolvedValue({
      requests: [],
      summary: {
        total: 7,
        active: 1,
        needs_input: 2,
        completed: 3,
        failed: 1,
      },
    })
  })

  it("loads the first page of requests and renders the summary", async () => {
    render(ActivityRequests)

    await waitFor(() => {
      expect(screen.getByText("7")).toBeInTheDocument()
    })
    expect(mocks.fetchAgentRequests).toHaveBeenCalledWith({
      limit: 20,
      page: 1,
      status: undefined,
    })
  })
})
