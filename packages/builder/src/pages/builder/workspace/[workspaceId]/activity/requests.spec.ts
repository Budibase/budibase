import { fireEvent, render, screen, waitFor } from "@testing-library/svelte"
import { beforeEach, describe, expect, it, vi } from "vitest"
import MockBody from "@/test/mocks/MockBody.svelte"
import MockButton from "@/test/mocks/MockButton.svelte"
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

vi.mock("@budibase/bbui", async importOriginal => ({
  ...(await importOriginal<typeof import("@budibase/bbui")>()),
  Body: MockBody,
  Button: MockButton,
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

  it("shows unavailable counters and a persistent error when loading fails", async () => {
    mocks.fetchAgentRequests.mockRejectedValueOnce(new Error("DB unavailable"))
    render(ActivityRequests)

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Failed to load requests."
    )
    expect(screen.getAllByText("Unavailable")).toHaveLength(5)
    for (const placeholder of screen.getAllByText("-")) {
      expect(placeholder).toHaveAttribute("aria-hidden", "true")
    }
    expect(screen.queryByText("0")).not.toBeInTheDocument()
  })

  it("restores the summary after retrying", async () => {
    mocks.fetchAgentRequests.mockRejectedValueOnce(new Error("DB unavailable"))
    render(ActivityRequests)

    await fireEvent.click(
      await screen.findByRole("button", { name: "Try again" })
    )

    expect(await screen.findByText("7")).toBeInTheDocument()
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    expect(screen.queryByText("Unavailable")).not.toBeInTheDocument()
    expect(mocks.fetchAgentRequests).toHaveBeenLastCalledWith({
      limit: 20,
      page: 1,
      status: undefined,
    })
  })

  it("retries the page that failed rather than returning to page one", async () => {
    mocks.fetchAgentRequests
      .mockResolvedValueOnce({
        requests: [
          {
            _id: "request-1",
            agentId: "agent-1",
            status: "completed",
            createdAt: "2026-10-05T11:00:00.000Z",
            entries: [],
            actions: [],
          },
        ],
        summary: {
          total: 21,
          active: 0,
          needs_input: 0,
          completed: 21,
          failed: 0,
        },
      })
      .mockRejectedValueOnce(new Error("DB unavailable"))

    const { container } = render(ActivityRequests)
    await screen.findByText("Showing 1–1 of 21 items")
    await fireEvent.click(
      container.querySelector<HTMLElement>(".spectrum-Pagination-nextButton")!
    )
    await fireEvent.click(
      await screen.findByRole("button", { name: "Try again" })
    )

    expect(await screen.findByText("7")).toBeInTheDocument()
    expect(
      mocks.fetchAgentRequests.mock.calls.map(([query]) => query.page)
    ).toEqual([1, 2, 2])
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })
})
