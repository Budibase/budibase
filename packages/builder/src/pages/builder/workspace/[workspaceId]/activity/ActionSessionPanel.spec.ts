import { fireEvent, render, screen, waitFor } from "@testing-library/svelte"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { BuilderSocketEvent } from "@budibase/shared-core"
import {
  Event,
  type ActionSession,
  type ActionSessionChangeEvent,
  type FetchActionSessionEventsResponse,
} from "@budibase/types"
import ActionSessionPanel from "./ActionSessionPanel.svelte"

const mocks = vi.hoisted(() => {
  const { writable } = require("svelte/store")
  type Handler = (payload?: ActionSessionChangeEvent) => void
  const handlers = new Map<string, Set<Handler>>()
  const socket = {
    on: (event: string, handler: Handler) => {
      if (!handlers.has(event)) {
        handlers.set(event, new Set())
      }
      handlers.get(event)!.add(handler)
    },
    off: (event: string, handler: Handler) => {
      handlers.get(event)?.delete(handler)
    },
    trigger: (event: string, payload?: ActionSessionChangeEvent) => {
      handlers.get(event)?.forEach(handler => handler(payload))
    },
    reset: () => handlers.clear(),
  }
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
    socket,
    builderStore: Object.assign(writable({ isResizingPanel: false }), {
      websocket: socket,
    }),
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

const renderPanel = (
  panelSession: ActionSession | undefined,
  { outdated = false }: { outdated?: boolean } = {}
) =>
  render(ActionSessionPanel, {
    props: { session: panelSession, outdated, onClose: vi.fn() },
  })

describe("ActionSessionPanel", () => {
  beforeEach(() => {
    mocks.socket.reset()
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

  it("warns that the details may be out of date", async () => {
    mocks.fetchActionSessionEvents.mockResolvedValue(
      eventsResponse({ ids: [] })
    )

    renderPanel(session, { outdated: true })

    expect(await screen.findByText("Details may be out of date")).toBeVisible()
    expect(
      screen.getByText("This session is no longer in the current results.")
    ).toBeVisible()
  })

  describe("live updates", () => {
    const SETTLE_MS = 50

    const change = (
      overrides: Partial<ActionSessionChangeEvent> = {}
    ): ActionSessionChangeEvent => ({
      environment: session.environment,
      sessions: [
        { sourceType: session.sourceType, sourceId: session.sourceId },
      ],
      ...overrides,
    })

    const notify = (event: ActionSessionChangeEvent = change()) =>
      mocks.socket.trigger(BuilderSocketEvent.ActionSessionChange, event)

    const settle = () => new Promise(resolve => setTimeout(resolve, SETTLE_MS))

    const bookmarks = () =>
      mocks.fetchActionSessionEvents.mock.calls.map(([opts]) => opts.bookmark)

    it("refreshes the current events page when its session changes", async () => {
      mocks.fetchActionSessionEvents
        .mockResolvedValueOnce(
          eventsResponse({
            ids: ["event-1"],
            total: 21,
            pagination: {
              hasNextPage: true,
              hasPreviousPage: false,
              nextBookmark: "next-1",
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
              previousBookmark: "prev-2",
            },
          })
        )
        .mockResolvedValueOnce(
          eventsResponse({
            ids: ["event-21", "event-22"],
            total: 22,
            pagination: {
              hasNextPage: false,
              hasPreviousPage: true,
              previousBookmark: "prev-2",
            },
          })
        )

      const { container } = renderPanel(session)
      await screen.findByText("Showing 1–1 of 21 items")
      await fireEvent.click(
        container.ownerDocument.querySelector<HTMLElement>(
          ".spectrum-Pagination-nextButton"
        )!
      )
      await screen.findByText("Showing 21–21 of 21 items")

      notify()

      expect(await screen.findByText("Showing 21–22 of 22 items")).toBeVisible()
      expect(screen.getAllByText(/Step executed/)).toHaveLength(2)
      expect(bookmarks()).toEqual([undefined, "next-1", "next-1"])
    })

    it("ignores changes of other sessions and environments", async () => {
      mocks.fetchActionSessionEvents.mockResolvedValue(
        eventsResponse({ ids: ["event-1"] })
      )

      renderPanel(session)
      await screen.findByText(/Step executed/)

      notify(
        change({
          sessions: [{ sourceType: session.sourceType, sourceId: "other" }],
        })
      )
      notify(change({ environment: "prod" }))
      notify(change({ environment: "prod", truncated: true }))

      await settle()
      expect(mocks.fetchActionSessionEvents).toHaveBeenCalledTimes(1)
    })

    it("refreshes on a truncated change in its environment", async () => {
      mocks.fetchActionSessionEvents.mockResolvedValue(
        eventsResponse({ ids: ["event-1"] })
      )

      renderPanel(session)
      await screen.findByText(/Step executed/)

      notify(change({ sessions: [], truncated: true }))

      await waitFor(() =>
        expect(mocks.fetchActionSessionEvents).toHaveBeenCalledTimes(2)
      )
    })

    it("coalesces changes received during a refresh into one more refresh", async () => {
      const refresh = deferred<FetchActionSessionEventsResponse>()
      mocks.fetchActionSessionEvents
        .mockResolvedValueOnce(eventsResponse({ ids: ["event-1"] }))
        .mockReturnValueOnce(refresh.promise)
        .mockResolvedValue(eventsResponse({ ids: ["event-1"] }))

      renderPanel(session)
      await screen.findByText(/Step executed/)

      notify()
      notify()
      notify()
      refresh.resolve(eventsResponse({ ids: ["event-1"] }))

      await waitFor(() =>
        expect(mocks.fetchActionSessionEvents).toHaveBeenCalledTimes(3)
      )
      await settle()
      expect(mocks.fetchActionSessionEvents).toHaveBeenCalledTimes(3)
    })

    it("keeps the current events when a refresh fails", async () => {
      mocks.fetchActionSessionEvents
        .mockResolvedValueOnce(eventsResponse({ ids: ["event-1"] }))
        .mockRejectedValueOnce(new Error("boom"))
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {})

      renderPanel(session)
      await screen.findByText(/Step executed/)

      notify()

      await waitFor(() =>
        expect(mocks.fetchActionSessionEvents).toHaveBeenCalledTimes(2)
      )
      await settle()
      expect(screen.getByText(/Step executed/)).toBeVisible()
      expect(
        screen.queryByRole("button", { name: "Try again" })
      ).not.toBeInTheDocument()
      errorSpy.mockRestore()
    })

    it("refreshes when the socket reconnects", async () => {
      mocks.fetchActionSessionEvents.mockResolvedValue(
        eventsResponse({ ids: ["event-1"] })
      )

      renderPanel(session)
      await screen.findByText(/Step executed/)

      mocks.socket.trigger("connect")

      await waitFor(() =>
        expect(mocks.fetchActionSessionEvents).toHaveBeenCalledTimes(2)
      )
    })

    it("does not refresh while closed", async () => {
      renderPanel(undefined)

      notify()
      mocks.socket.trigger("connect")

      await settle()
      expect(mocks.fetchActionSessionEvents).not.toHaveBeenCalled()
    })
  })
})
