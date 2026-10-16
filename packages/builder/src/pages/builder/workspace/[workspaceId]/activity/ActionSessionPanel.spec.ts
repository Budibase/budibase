import { fireEvent, render, screen } from "@testing-library/svelte"
import { beforeEach, describe, expect, it, vi } from "vitest"
import {
  Event,
  type ActionSession,
  type FetchActionSessionEventsResponse,
} from "@budibase/types"
import ActionSessionPanel from "./ActionSessionPanel.svelte"

const mocks = vi.hoisted(() => {
  const { writable } = require("svelte/store")
  return {
    fetchActionSessionEvents: vi.fn(),
    automationStore: writable({
      blockDefinitions: {
        TRIGGER: {},
        CREATABLE_TRIGGER: {},
        ACTION: { CREATE_ROW: { name: "Create Row" } },
      },
    }),
    agentsStore: writable({ agents: [] }),
    builderStore: writable({ isResizingPanel: false }),
  }
})

vi.mock("@/api", () => ({
  API: { fetchActionSessionEvents: mocks.fetchActionSessionEvents },
}))

vi.mock("@/stores/builder", () => ({
  automationStore: mocks.automationStore,
  builderStore: mocks.builderStore,
}))

vi.mock("@/stores/portal", () => ({
  agentsStore: mocks.agentsStore,
}))

const session: ActionSession = {
  sourceType: "automation_run",
  sourceId: "run/1",
  environment: "dev",
  status: "completed",
  actionCount: 2,
  assetLabel: "Nightly sync",
  startedAt: "2026-10-05T11:00:00.000Z",
  updatedAt: "2026-10-05T11:05:00.000Z",
}

const eventsResponse = ({
  ids,
  pagination = { hasNextPage: false, hasPreviousPage: false },
  total = ids.length,
}: {
  ids: string[]
  pagination?: FetchActionSessionEventsResponse["pagination"]
  total?: number
}): FetchActionSessionEventsResponse => ({
  events: ids.map(id => ({
    id,
    eventName: Event.ACTION_AUTOMATION_STEP_EXECUTED,
    timestamp: "2026-10-05T11:01:00.000Z",
    payload: { stepId: "CREATE_ROW", label: id },
  })),
  summary: { total },
  pagination,
})

const deferred = <T>() => {
  let resolve!: (value: T) => void
  const promise = new Promise<T>(res => {
    resolve = res
  })
  return { promise, resolve }
}

const renderPanel = (panelSession: ActionSession | undefined) =>
  render(ActionSessionPanel, {
    props: { session: panelSession, onClose: vi.fn() },
  })

describe("ActionSessionPanel", () => {
  beforeEach(() => {
    mocks.fetchActionSessionEvents.mockReset()
    mocks.agentsStore.set({ agents: [] })
  })

  it.each([
    {
      scenario: "renamed",
      agents: [{ _id: "agent-1", name: "Renamed agent" }],
    },
    { scenario: "deleted", agents: [] },
  ])(
    "keeps the historical name in the timeline of a $scenario agent",
    async ({ agents }) => {
      mocks.agentsStore.set({ agents })
      const response: FetchActionSessionEventsResponse = {
        events: [
          {
            id: "event-1",
            eventName: Event.ACTION_AI_AGENT_EXECUTED,
            timestamp: session.startedAt,
            payload: { agentId: "agent-1" },
          },
        ],
        summary: { total: 1 },
        pagination: { hasNextPage: false, hasPreviousPage: false },
      }
      mocks.fetchActionSessionEvents.mockResolvedValue(response)

      renderPanel({
        ...session,
        sourceType: "agent_session",
        sourceId: "session-1",
        actionCount: 1,
        assetType: "agent",
        assetId: "agent-1",
        assetLabel: "Historical agent",
      })

      expect(
        await screen.findByText("Agent executed: Historical agent")
      ).toBeVisible()
    }
  )

  it("does not load events while closed", () => {
    renderPanel(undefined)

    expect(mocks.fetchActionSessionEvents).not.toHaveBeenCalled()
  })

  it("loads the timeline of the selected session in its own environment", async () => {
    mocks.fetchActionSessionEvents.mockResolvedValue(
      eventsResponse({ ids: ["event-1"] })
    )

    renderPanel(session)

    expect(await screen.findByText(/Step executed: Create Row/)).toBeVisible()
    expect(mocks.fetchActionSessionEvents).toHaveBeenCalledWith({
      sourceType: "automation_run",
      sourceId: "run/1",
      env: "dev",
      limit: 20,
      bookmark: undefined,
    })
  })

  it("pages through events with their own bookmarks and total", async () => {
    mocks.fetchActionSessionEvents
      .mockResolvedValueOnce(
        eventsResponse({
          ids: ["event-1"],
          total: 21,
          pagination: {
            hasNextPage: true,
            hasPreviousPage: false,
            nextBookmark: "events-next",
          },
        })
      )
      .mockResolvedValueOnce(
        eventsResponse({
          ids: ["event-21"],
          total: 21,
          pagination: {
            hasNextPage: false,
            hasPreviousPage: true,
            previousBookmark: "events-prev",
          },
        })
      )

    const { container } = renderPanel(session)

    expect(await screen.findByText("Showing 1–1 of 21 items")).toBeVisible()
    await fireEvent.click(
      container.ownerDocument.querySelector<HTMLElement>(
        ".spectrum-Pagination-nextButton"
      )!
    )

    expect(await screen.findByText("Showing 21–21 of 21 items")).toBeVisible()
    expect(
      mocks.fetchActionSessionEvents.mock.calls.map(([query]) => query.bookmark)
    ).toEqual([undefined, "events-next"])
  })

  it("keeps events visible and disables pagination while the next page loads", async () => {
    const nextPage = deferred<FetchActionSessionEventsResponse>()
    mocks.fetchActionSessionEvents
      .mockResolvedValueOnce(
        eventsResponse({
          ids: ["event-1"],
          total: 21,
          pagination: {
            hasNextPage: true,
            hasPreviousPage: false,
            nextBookmark: "events-next",
          },
        })
      )
      .mockReturnValueOnce(nextPage.promise)

    const { container } = renderPanel(session)
    await screen.findByText("Showing 1–1 of 21 items")
    const nextButton = container.ownerDocument.querySelector<HTMLElement>(
      ".spectrum-Pagination-nextButton"
    )!
    await fireEvent.click(nextButton)

    expect(screen.getByRole("status")).toHaveTextContent("Loading events...")
    expect(screen.getByText(/Step executed: Create Row/)).toBeVisible()
    expect(nextButton).toHaveClass("is-disabled")
    await fireEvent.click(nextButton)
    expect(mocks.fetchActionSessionEvents).toHaveBeenCalledTimes(2)

    nextPage.resolve(
      eventsResponse({
        ids: ["event-21"],
        total: 21,
        pagination: {
          hasNextPage: false,
          hasPreviousPage: true,
          previousBookmark: "events-prev",
        },
      })
    )

    expect(await screen.findByText("Showing 21–21 of 21 items")).toBeVisible()
    expect(screen.queryByRole("status")).not.toBeInTheDocument()
    expect(
      container.ownerDocument.querySelector(".spectrum-Pagination-prevButton")
    ).not.toHaveClass("is-disabled")
  })

  it("discards events of a previously selected session", async () => {
    const firstSession = deferred<FetchActionSessionEventsResponse>()
    mocks.fetchActionSessionEvents
      .mockReturnValueOnce(firstSession.promise)
      .mockResolvedValueOnce(eventsResponse({ ids: ["event-2"] }))

    const { rerender } = renderPanel(session)
    await rerender({
      session: { ...session, environment: "prod" },
      onClose: vi.fn(),
    })
    await screen.findByText(/Step executed: Create Row/)

    firstSession.resolve(eventsResponse({ ids: ["event-a", "event-b"] }))
    await new Promise(resolve => setTimeout(resolve))

    expect(screen.getAllByText(/Step executed/)).toHaveLength(1)
    expect(mocks.fetchActionSessionEvents).toHaveBeenLastCalledWith(
      expect.objectContaining({ env: "prod", bookmark: undefined })
    )
  })

  it("shows an empty timeline", async () => {
    mocks.fetchActionSessionEvents.mockResolvedValue(
      eventsResponse({ ids: [] })
    )

    renderPanel(session)

    expect(await screen.findByText("No events recorded yet.")).toBeVisible()
  })

  it("retries the events page that failed to load", async () => {
    mocks.fetchActionSessionEvents
      .mockRejectedValueOnce(new Error("boom"))
      .mockResolvedValueOnce(eventsResponse({ ids: ["event-1"] }))

    renderPanel(session)

    await fireEvent.click(
      await screen.findByRole("button", { name: "Try again" })
    )

    expect(await screen.findByText(/Step executed: Create Row/)).toBeVisible()
    expect(mocks.fetchActionSessionEvents).toHaveBeenCalledTimes(2)
  })
})
