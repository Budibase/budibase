import { fireEvent, render, screen, waitFor } from "@testing-library/svelte"
import { beforeEach, describe, expect, it, vi } from "vitest"
import type { FetchActionSessionsResponse } from "@budibase/types"
import ActivityActions from "./actions.svelte"

const mocks = vi.hoisted(() => ({
  fetchActionSessions: vi.fn(),
}))

vi.mock("@/api", () => ({
  API: { fetchActionSessions: mocks.fetchActionSessions },
}))

const response: FetchActionSessionsResponse = {
  sessions: [
    {
      sourceType: "agent_session",
      sourceId: "session-1",
      environment: "prod",
      status: "completed",
      actionCount: 4,
      assetLabel: "Support agent",
      startedAt: "2026-10-05T11:00:00.000Z",
      updatedAt: "2026-10-05T11:55:00.000Z",
    },
  ],
  summary: { total: 1, active: 0, waiting: 0, completed: 1, failed: 0 },
  pagination: { hasNextPage: false, hasPreviousPage: false },
}

describe("Activity actions page", () => {
  beforeEach(() => {
    mocks.fetchActionSessions.mockReset()
  })

  it("renders the sessions returned by the API", async () => {
    mocks.fetchActionSessions.mockResolvedValue(response)

    render(ActivityActions)

    await waitFor(() => {
      expect(screen.getByText("Support agent")).toBeInTheDocument()
    })
    expect(mocks.fetchActionSessions).toHaveBeenCalledWith({ limit: 20 })
    expect(screen.getByText("Agent request")).toBeInTheDocument()
    expect(screen.getByText("Unknown")).toBeInTheDocument()
    expect(screen.getByText("Completed")).toBeInTheDocument()
    expect(screen.getByText("4")).toBeInTheDocument()
  })

  it("shows an empty state when there are no sessions", async () => {
    mocks.fetchActionSessions.mockResolvedValue({ ...response, sessions: [] })

    render(ActivityActions)

    await waitFor(() => {
      expect(screen.getByText("No actions tracked yet.")).toBeInTheDocument()
    })
  })

  it("shows an error state and retries the request", async () => {
    mocks.fetchActionSessions
      .mockRejectedValueOnce(new Error("boom"))
      .mockResolvedValueOnce(response)

    render(ActivityActions)

    await fireEvent.click(
      await screen.findByRole("button", { name: "Try again" })
    )

    await waitFor(() => {
      expect(screen.getByText("Support agent")).toBeInTheDocument()
    })
    expect(mocks.fetchActionSessions).toHaveBeenCalledTimes(2)
  })
})
