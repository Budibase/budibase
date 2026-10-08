import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/svelte"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { BuilderSocketEvent } from "@budibase/shared-core"
import type {
  ActionSessionChangeEvent,
  FetchActionSessionsResponse,
  FetchActionSessionsQuery,
} from "@budibase/types"
import ActivityActions from "./actions.svelte"

const mocks = vi.hoisted(() => ({
  fetchActionSessions: vi.fn(),
  fetchActionSessionEvents: vi.fn(),
}))

const socket = vi.hoisted(() => {
  type Handler = (payload?: ActionSessionChangeEvent) => void
  const handlers = new Map<string, Set<Handler>>()
  return {
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
    listenerCount: (event: string) => handlers.get(event)?.size ?? 0,
    reset: () => handlers.clear(),
  }
})

vi.mock("@/stores/builder", async importOriginal => {
  const actual = await importOriginal<typeof import("@/stores/builder")>()
  // Keep the real store, other components subscribe to it
  Object.assign(actual.builderStore, { websocket: socket })
  return actual
})

vi.mock("@budibase/bbui", async importOriginal => {
  const { default: Select } = await import(
    "@/components/common/tests/MockSelect.svelte"
  )
  return {
    ...(await importOriginal<typeof import("@budibase/bbui")>()),
    Select,
  }
})

vi.mock("@/api", () => ({
  API: {
    fetchActionSessions: mocks.fetchActionSessions,
    fetchActionSessionEvents: mocks.fetchActionSessionEvents,
  },
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
  summary: { total: 15, active: 1, waiting: 2, completed: 5, failed: 7 },
  pagination: { hasNextPage: false, hasPreviousPage: false },
}

const deferred = <T>() => {
  let resolve!: (value: T) => void
  const promise = new Promise<T>(res => {
    resolve = res
  })
  return { promise, resolve }
}

const renderPage = () => {
  const { container, unmount } = render(ActivityActions)
  const table = () =>
    within(container.querySelector<HTMLElement>(".spectrum-Table")!)
  const pageButton = (direction: "prev" | "next") =>
    container.querySelector<HTMLElement>(
      `.spectrum-Pagination-${direction}Button`
    )
  const findInTable = (text: string) => waitFor(() => table().getByText(text))
  return { table, pageButton, findInTable, unmount }
}

const pageResponse = ({
  assetLabel,
  pagination,
}: {
  assetLabel: string
  pagination: FetchActionSessionsResponse["pagination"]
}): FetchActionSessionsResponse => ({
  ...response,
  sessions: [{ ...response.sessions[0], assetLabel }],
  summary: { ...response.summary, total: 21 },
  pagination,
})

describe("Activity actions page", () => {
  beforeEach(() => {
    socket.reset()
    mocks.fetchActionSessions.mockReset()
    mocks.fetchActionSessionEvents.mockResolvedValue({
      events: [],
      summary: { total: 0 },
      pagination: { hasNextPage: false, hasPreviousPage: false },
    })
  })

  it("loads sessions from all environments and renders them with the summary", async () => {
    mocks.fetchActionSessions.mockResolvedValue(response)

    const { table } = renderPage()

    await waitFor(() => {
      expect(table().getByText("Support agent")).toBeInTheDocument()
    })
    expect(mocks.fetchActionSessions).toHaveBeenCalledWith({
      env: undefined,
      status: undefined,
      limit: 20,
    })
    expect(screen.getByText("All actions")).toBeInTheDocument()
    expect(table().getByText("Agent request")).toBeInTheDocument()
    expect(table().getByText("Unknown")).toBeInTheDocument()
    expect(table().getByText("Completed")).toBeInTheDocument()
    expect(table().getByText("4")).toBeInTheDocument()
    for (const value of ["15", "1", "2", "5", "7"]) {
      expect(screen.getByText(value)).toBeInTheDocument()
    }
  })

  it("requests sessions server-side when the filters change", async () => {
    mocks.fetchActionSessions.mockResolvedValue(response)

    renderPage()

    await fireEvent.change(screen.getByDisplayValue("All statuses"), {
      target: { value: "failed" },
    })
    await fireEvent.change(screen.getByDisplayValue("All environments"), {
      target: { value: "prod" },
    })

    const queries: FetchActionSessionsQuery[] =
      mocks.fetchActionSessions.mock.calls.map(([query]) => query)
    expect(queries).toEqual([
      { env: undefined, status: undefined, limit: 20 },
      { env: undefined, status: "failed", limit: 20 },
      { env: "prod", status: "failed", limit: 20 },
    ])
  })

  it("replaces old counters with loading indicators when changing environment", async () => {
    const pending = deferred<FetchActionSessionsResponse>()
    mocks.fetchActionSessions
      .mockResolvedValueOnce(response)
      .mockReturnValueOnce(pending.promise)
    renderPage()
    await screen.findByText("15")

    await fireEvent.change(screen.getByDisplayValue("All environments"), {
      target: { value: "prod" },
    })

    expect(
      screen.getByRole("status", { name: "Loading All actions" })
    ).toBeInTheDocument()
    expect(screen.queryByText("15")).not.toBeInTheDocument()

    pending.resolve({
      ...response,
      summary: { total: 8, completed: 8, active: 0, waiting: 0, failed: 0 },
    })

    await waitFor(() => {
      expect(
        screen.queryByRole("status", { name: "Loading All actions" })
      ).not.toBeInTheDocument()
    })
    expect(screen.getAllByText("8")).toHaveLength(2)
  })

  it("ignores a stale response that resolves after a newer one", async () => {
    const initial = deferred<FetchActionSessionsResponse>()
    mocks.fetchActionSessions
      .mockReturnValueOnce(initial.promise)
      .mockResolvedValueOnce({
        ...response,
        sessions: [{ ...response.sessions[0], assetLabel: "Dev agent" }],
      })

    const { table } = renderPage()

    await fireEvent.change(screen.getByDisplayValue("All environments"), {
      target: { value: "dev" },
    })
    await waitFor(() => {
      expect(table().getByText("Dev agent")).toBeInTheDocument()
    })
    initial.resolve(response)

    await waitFor(() => {
      expect(table().queryByText("Support agent")).not.toBeInTheDocument()
    })
    expect(table().getByText("Dev agent")).toBeInTheDocument()
  })

  it("navigates between pages using the response bookmarks", async () => {
    mocks.fetchActionSessions
      .mockResolvedValueOnce(
        pageResponse({
          assetLabel: "First page",
          pagination: {
            hasNextPage: true,
            hasPreviousPage: false,
            nextBookmark: "next-1",
          },
        })
      )
      .mockResolvedValueOnce(
        pageResponse({
          assetLabel: "Second page",
          pagination: {
            hasNextPage: false,
            hasPreviousPage: true,
            previousBookmark: "prev-2",
          },
        })
      )
      .mockResolvedValueOnce(
        pageResponse({
          assetLabel: "First page again",
          pagination: {
            hasNextPage: true,
            hasPreviousPage: false,
            nextBookmark: "next-1",
          },
        })
      )

    const { table, pageButton } = renderPage()

    await waitFor(() => {
      expect(table().getByText("First page")).toBeInTheDocument()
    })
    expect(screen.getByText("Showing 1–1 of 21 items")).toBeInTheDocument()

    await fireEvent.click(pageButton("next")!)
    await waitFor(() => {
      expect(table().getByText("Second page")).toBeInTheDocument()
    })
    expect(screen.getByText("Showing 21–21 of 21 items")).toBeInTheDocument()
    expect(screen.getByText("Page 2")).toBeInTheDocument()

    await fireEvent.click(pageButton("prev")!)
    await waitFor(() => {
      expect(table().getByText("First page again")).toBeInTheDocument()
    })
    expect(screen.getByText("Page 1")).toBeInTheDocument()

    expect(
      mocks.fetchActionSessions.mock.calls.map(([query]) => query.bookmark)
    ).toEqual([undefined, "next-1", undefined])
  })

  it("uses the previous bookmark when going back to a page after the first", async () => {
    mocks.fetchActionSessions
      .mockResolvedValueOnce(
        pageResponse({
          assetLabel: "First page",
          pagination: {
            hasNextPage: true,
            hasPreviousPage: false,
            nextBookmark: "next-1",
          },
        })
      )
      .mockResolvedValueOnce(
        pageResponse({
          assetLabel: "Second page",
          pagination: {
            hasNextPage: true,
            hasPreviousPage: true,
            nextBookmark: "next-2",
            previousBookmark: "prev-2",
          },
        })
      )
      .mockResolvedValueOnce(
        pageResponse({
          assetLabel: "Third page",
          pagination: {
            hasNextPage: false,
            hasPreviousPage: true,
            previousBookmark: "prev-3",
          },
        })
      )
      .mockResolvedValueOnce(
        pageResponse({
          assetLabel: "Second page again",
          pagination: {
            hasNextPage: true,
            hasPreviousPage: true,
            nextBookmark: "next-2",
            previousBookmark: "prev-2",
          },
        })
      )

    const { findInTable, pageButton } = renderPage()
    await findInTable("First page")
    await fireEvent.click(pageButton("next")!)
    await findInTable("Second page")
    await fireEvent.click(pageButton("next")!)
    await findInTable("Third page")
    await fireEvent.click(pageButton("prev")!)

    await findInTable("Second page again")
    expect(screen.getByText("Page 2")).toBeInTheDocument()
    expect(
      mocks.fetchActionSessions.mock.calls.map(([query]) => query.bookmark)
    ).toEqual([undefined, "next-1", "next-2", "prev-3"])
  })

  it("returns to the first page when a later page is empty", async () => {
    mocks.fetchActionSessions
      .mockResolvedValueOnce(
        pageResponse({
          assetLabel: "First page",
          pagination: {
            hasNextPage: true,
            hasPreviousPage: false,
            nextBookmark: "next-1",
          },
        })
      )
      .mockResolvedValueOnce({
        ...response,
        sessions: [],
        pagination: { hasNextPage: false, hasPreviousPage: false },
      })
      .mockResolvedValueOnce(
        pageResponse({
          assetLabel: "First page reloaded",
          pagination: {
            hasNextPage: true,
            hasPreviousPage: false,
            nextBookmark: "next-1b",
          },
        })
      )

    const { findInTable, pageButton } = renderPage()
    await findInTable("First page")
    await fireEvent.click(pageButton("next")!)

    await findInTable("First page reloaded")
    expect(screen.getByText("Page 1")).toBeInTheDocument()
    expect(
      mocks.fetchActionSessions.mock.calls.map(([query]) => query.bookmark)
    ).toEqual([undefined, "next-1", undefined])
  })

  it("disables pagination while loading and restores it after the response", async () => {
    const pending = deferred<FetchActionSessionsResponse>()
    mocks.fetchActionSessions
      .mockResolvedValueOnce(
        pageResponse({
          assetLabel: "First page",
          pagination: {
            hasNextPage: true,
            hasPreviousPage: false,
            nextBookmark: "next-1",
          },
        })
      )
      .mockReturnValueOnce(pending.promise)

    const { findInTable, pageButton } = renderPage()
    await findInTable("First page")
    await fireEvent.click(pageButton("next")!)

    expect(pageButton("prev")).toHaveClass("is-disabled")
    expect(pageButton("next")).toHaveClass("is-disabled")
    await fireEvent.click(pageButton("next")!)
    await fireEvent.click(pageButton("prev")!)

    pending.resolve(
      pageResponse({
        assetLabel: "Second page",
        pagination: {
          hasNextPage: true,
          hasPreviousPage: true,
          nextBookmark: "next-2",
          previousBookmark: "prev-2",
        },
      })
    )

    await findInTable("Second page")
    expect(pageButton("prev")).not.toHaveClass("is-disabled")
    expect(pageButton("next")).not.toHaveClass("is-disabled")
    expect(mocks.fetchActionSessions).toHaveBeenCalledTimes(2)
  })

  it("returns to the first page when a filter changes", async () => {
    mocks.fetchActionSessions
      .mockResolvedValueOnce(
        pageResponse({
          assetLabel: "First page",
          pagination: {
            hasNextPage: true,
            hasPreviousPage: false,
            nextBookmark: "next-1",
          },
        })
      )
      .mockResolvedValueOnce(
        pageResponse({
          assetLabel: "Second page",
          pagination: {
            hasNextPage: false,
            hasPreviousPage: true,
            previousBookmark: "prev-2",
          },
        })
      )
      .mockResolvedValueOnce(
        pageResponse({
          assetLabel: "Failed sessions",
          pagination: { hasNextPage: false, hasPreviousPage: false },
        })
      )

    const { table, pageButton } = renderPage()

    await waitFor(() => {
      expect(table().getByText("First page")).toBeInTheDocument()
    })
    await fireEvent.click(pageButton("next")!)
    await waitFor(() => {
      expect(table().getByText("Second page")).toBeInTheDocument()
    })

    await fireEvent.change(screen.getByDisplayValue("All statuses"), {
      target: { value: "failed" },
    })

    await waitFor(() => {
      expect(table().getByText("Failed sessions")).toBeInTheDocument()
    })
    expect(mocks.fetchActionSessions).toHaveBeenLastCalledWith({
      env: undefined,
      status: "failed",
      limit: 20,
      bookmark: undefined,
    })
    expect(screen.getByText("Showing 1–1 of 7 items")).toBeInTheDocument()
    expect(pageButton("next")).not.toBeInTheDocument()
  })

  it("retries the page that failed to load", async () => {
    mocks.fetchActionSessions
      .mockResolvedValueOnce(
        pageResponse({
          assetLabel: "First page",
          pagination: {
            hasNextPage: true,
            hasPreviousPage: false,
            nextBookmark: "next-1",
          },
        })
      )
      .mockRejectedValueOnce(new Error("boom"))
      .mockResolvedValueOnce(
        pageResponse({
          assetLabel: "Second page",
          pagination: {
            hasNextPage: false,
            hasPreviousPage: true,
            previousBookmark: "prev-2",
          },
        })
      )

    const { table, pageButton } = renderPage()

    await waitFor(() => {
      expect(table().getByText("First page")).toBeInTheDocument()
    })
    await fireEvent.click(pageButton("next")!)
    await fireEvent.click(
      await screen.findByRole("button", { name: "Try again" })
    )

    await waitFor(() => {
      expect(table().getByText("Second page")).toBeInTheDocument()
    })
    expect(
      mocks.fetchActionSessions.mock.calls.map(([query]) => query.bookmark)
    ).toEqual([undefined, "next-1", "next-1"])
    expect(screen.getByText("Page 2")).toBeInTheDocument()
  })

  describe("session panel", () => {
    const sameSourceInBothEnvironments: FetchActionSessionsResponse = {
      ...response,
      sessions: [
        { ...response.sessions[0], assetLabel: "Prod agent" },
        {
          ...response.sessions[0],
          environment: "dev",
          status: "failed",
          actionCount: 9,
          assetLabel: "Dev agent",
        },
      ],
    }

    const panel = () =>
      within(document.querySelector<HTMLElement>(".activity-panel-container")!)

    it("opens the selected session using its own environment", async () => {
      mocks.fetchActionSessions.mockResolvedValue(sameSourceInBothEnvironments)

      const { findInTable } = renderPage()

      await fireEvent.click(await findInTable("Dev agent"))

      expect(panel().getByText("Development")).toBeInTheDocument()
      expect(panel().getByText("Failed")).toBeInTheDocument()
      expect(panel().getByText("9")).toBeInTheDocument()
      expect(panel().queryByText("Production")).not.toBeInTheDocument()
    })

    it("keeps the current page when the panel is closed", async () => {
      mocks.fetchActionSessions
        .mockResolvedValueOnce(
          pageResponse({
            assetLabel: "First page",
            pagination: {
              hasNextPage: true,
              hasPreviousPage: false,
              nextBookmark: "next-1",
            },
          })
        )
        .mockResolvedValueOnce(
          pageResponse({
            assetLabel: "Second page",
            pagination: {
              hasNextPage: false,
              hasPreviousPage: true,
              previousBookmark: "prev-2",
            },
          })
        )

      const { table, pageButton, findInTable } = renderPage()

      await fireEvent.click(await findInTable("First page"))
      await fireEvent.click(pageButton("next")!)
      await fireEvent.click(await findInTable("Second page"))
      await fireEvent.click(
        document.querySelector<HTMLElement>(".activity-panel-overlay")!
      )

      await waitFor(() => {
        expect(
          document.querySelector(".activity-panel-container")
        ).not.toBeInTheDocument()
      })
      expect(table().getByText("Second page")).toBeInTheDocument()
      expect(screen.getByText("Page 2")).toBeInTheDocument()
      expect(mocks.fetchActionSessions).toHaveBeenCalledTimes(2)
    })

    it("closes the panel when a filter changes", async () => {
      mocks.fetchActionSessions.mockResolvedValue(sameSourceInBothEnvironments)

      const { findInTable } = renderPage()

      await fireEvent.click(await findInTable("Prod agent"))
      expect(panel().getByText("Production")).toBeInTheDocument()

      await fireEvent.change(screen.getByDisplayValue("All statuses"), {
        target: { value: "failed" },
      })

      await waitFor(() => {
        expect(
          document.querySelector(".activity-panel-container")
        ).not.toBeInTheDocument()
      })
    })
  })

  it("shows an empty state when there are no sessions", async () => {
    mocks.fetchActionSessions.mockResolvedValue({ ...response, sessions: [] })

    renderPage()

    await waitFor(() => {
      expect(screen.getByText("No actions tracked yet.")).toBeInTheDocument()
    })
    expect(mocks.fetchActionSessions).toHaveBeenCalledTimes(1)
  })

  it("explains an empty result caused by the status filter", async () => {
    mocks.fetchActionSessions.mockResolvedValue({ ...response, sessions: [] })

    renderPage()

    await fireEvent.change(screen.getByDisplayValue("All statuses"), {
      target: { value: "waiting" },
    })

    await waitFor(() => {
      expect(
        screen.getByText("No actions match the selected filters.")
      ).toBeInTheDocument()
    })
  })

  it.each(["prod", "dev"])(
    "explains an empty result when only the %s environment filter is applied",
    async env => {
      mocks.fetchActionSessions
        .mockResolvedValueOnce(response)
        .mockResolvedValueOnce({
          ...response,
          sessions: [],
          summary: { total: 0, active: 0, waiting: 0, completed: 0, failed: 0 },
        })

      const { findInTable } = renderPage()
      await findInTable("Support agent")

      await fireEvent.change(screen.getByDisplayValue("All environments"), {
        target: { value: env },
      })

      expect(
        await screen.findByText("No actions match the selected filters.")
      ).toBeInTheDocument()
      expect(
        screen.queryByText("No actions tracked yet.")
      ).not.toBeInTheDocument()
    }
  )

  it("shows unavailable counters when loading fails", async () => {
    mocks.fetchActionSessions.mockRejectedValueOnce(new Error("boom"))

    renderPage()

    await screen.findByRole("button", { name: "Try again" })
    expect(screen.getAllByText("Unavailable")).toHaveLength(5)
    for (const placeholder of screen.getAllByText("-")) {
      expect(placeholder).toHaveAttribute("aria-hidden", "true")
    }
    expect(screen.queryByText("0")).not.toBeInTheDocument()
  })

  it("shows zero counters for a successful empty response", async () => {
    mocks.fetchActionSessions.mockResolvedValueOnce({
      ...response,
      sessions: [],
      summary: { total: 0, active: 0, waiting: 0, completed: 0, failed: 0 },
    })

    renderPage()

    await screen.findByText("No actions tracked yet.")
    expect(screen.getAllByText("0")).toHaveLength(5)
    expect(screen.queryByText("Unavailable")).not.toBeInTheDocument()
  })

  it("restores counters after retrying a failed request", async () => {
    mocks.fetchActionSessions
      .mockRejectedValueOnce(new Error("boom"))
      .mockResolvedValueOnce(response)

    const { table } = renderPage()

    await fireEvent.click(
      await screen.findByRole("button", { name: "Try again" })
    )

    await waitFor(() => {
      expect(table().getByText("Support agent")).toBeInTheDocument()
    })
    expect(mocks.fetchActionSessions).toHaveBeenCalledTimes(2)
    expect(screen.queryByText("Unavailable")).not.toBeInTheDocument()
    for (const value of ["15", "1", "2", "5", "7"]) {
      expect(screen.getByText(value)).toBeInTheDocument()
    }
  })

  describe("live updates", () => {
    const SETTLE_MS = 50

    const change = (
      overrides: Partial<ActionSessionChangeEvent> = {}
    ): ActionSessionChangeEvent => ({
      environment: "prod",
      sessions: [{ sourceType: "agent_session", sourceId: "session-1" }],
      ...overrides,
    })

    const notify = (event: ActionSessionChangeEvent = change()) =>
      socket.trigger(BuilderSocketEvent.ActionSessionChange, event)

    const settle = () => new Promise(resolve => setTimeout(resolve, SETTLE_MS))

    const queries = (): FetchActionSessionsQuery[] =>
      mocks.fetchActionSessions.mock.calls.map(([query]) => query)

    const panel = () =>
      within(document.querySelector<HTMLElement>(".activity-panel-container")!)

    it("refreshes the current page with the active filters and bookmark", async () => {
      mocks.fetchActionSessions
        .mockResolvedValueOnce(response)
        .mockResolvedValueOnce(
          pageResponse({
            assetLabel: "First page",
            pagination: {
              hasNextPage: true,
              hasPreviousPage: false,
              nextBookmark: "next-1",
            },
          })
        )
        .mockResolvedValueOnce(
          pageResponse({
            assetLabel: "Second page",
            pagination: {
              hasNextPage: false,
              hasPreviousPage: true,
              previousBookmark: "prev-2",
            },
          })
        )
        .mockResolvedValueOnce({
          ...pageResponse({
            assetLabel: "Second page updated",
            pagination: {
              hasNextPage: false,
              hasPreviousPage: true,
              previousBookmark: "prev-2",
            },
          }),
          summary: {
            total: 22,
            active: 1,
            waiting: 2,
            completed: 5,
            failed: 8,
          },
        })

      const { findInTable, pageButton } = renderPage()
      await findInTable("Support agent")
      await fireEvent.change(screen.getByDisplayValue("All statuses"), {
        target: { value: "failed" },
      })
      await findInTable("First page")
      await fireEvent.click(pageButton("next")!)
      await findInTable("Second page")

      notify()

      await findInTable("Second page updated")
      expect(queries().at(-1)).toEqual({
        env: undefined,
        status: "failed",
        limit: 20,
        bookmark: "next-1",
      })
      expect(screen.getByText("Page 2")).toBeInTheDocument()
      expect(screen.getByText("22")).toBeInTheDocument()
    })

    it("keeps the open panel while refreshing in the background", async () => {
      mocks.fetchActionSessions
        .mockResolvedValueOnce(response)
        .mockResolvedValueOnce({
          ...response,
          sessions: [{ ...response.sessions[0], actionCount: 6 }],
        })

      const { findInTable } = renderPage()
      await fireEvent.click(await findInTable("Support agent"))

      notify()

      await waitFor(() => {
        expect(panel().getByText("6")).toBeInTheDocument()
      })
    })

    it("ignores changes from an environment outside the filter", async () => {
      mocks.fetchActionSessions.mockResolvedValue(response)

      const { findInTable } = renderPage()
      await findInTable("Support agent")
      await fireEvent.change(screen.getByDisplayValue("All environments"), {
        target: { value: "dev" },
      })
      await waitFor(() => expect(queries()).toHaveLength(2))

      notify(change({ environment: "prod" }))
      notify(change({ environment: "dev" }))

      await waitFor(() => expect(queries()).toHaveLength(3))
      await settle()
      expect(queries()).toHaveLength(3)
      expect(queries().at(-1)).toEqual(expect.objectContaining({ env: "dev" }))
    })

    it("coalesces changes received during a refresh into one more refresh", async () => {
      const refresh = deferred<FetchActionSessionsResponse>()
      mocks.fetchActionSessions
        .mockResolvedValueOnce(response)
        .mockReturnValueOnce(refresh.promise)
        .mockResolvedValue(response)

      const { findInTable } = renderPage()
      await findInTable("Support agent")

      notify()
      notify()
      notify()
      notify()
      refresh.resolve(response)

      await waitFor(() => expect(queries()).toHaveLength(3))
      await settle()
      expect(queries()).toHaveLength(3)
    })

    it("refreshes again after a filter load that was in flight when a change arrived", async () => {
      const filtered = deferred<FetchActionSessionsResponse>()
      mocks.fetchActionSessions
        .mockResolvedValueOnce(response)
        .mockReturnValueOnce(filtered.promise)
        .mockResolvedValueOnce({
          ...response,
          sessions: [{ ...response.sessions[0], assetLabel: "Refreshed" }],
        })

      const { findInTable } = renderPage()
      await findInTable("Support agent")
      await fireEvent.change(screen.getByDisplayValue("All statuses"), {
        target: { value: "failed" },
      })

      notify()
      filtered.resolve(response)

      await findInTable("Refreshed")
      expect(queries().at(-1)).toEqual(
        expect.objectContaining({ status: "failed" })
      )
    })

    it("discards a background response superseded by a filter change", async () => {
      const refresh = deferred<FetchActionSessionsResponse>()
      mocks.fetchActionSessions
        .mockResolvedValueOnce(response)
        .mockReturnValueOnce(refresh.promise)
        .mockResolvedValueOnce({
          ...response,
          sessions: [
            { ...response.sessions[0], assetLabel: "Failed sessions" },
          ],
        })

      const { findInTable, table } = renderPage()
      await findInTable("Support agent")

      notify()
      await fireEvent.change(screen.getByDisplayValue("All statuses"), {
        target: { value: "failed" },
      })
      await findInTable("Failed sessions")
      refresh.resolve({
        ...response,
        sessions: [{ ...response.sessions[0], assetLabel: "Stale refresh" }],
      })

      await settle()
      expect(table().queryByText("Stale refresh")).not.toBeInTheDocument()
      expect(table().getByText("Failed sessions")).toBeInTheDocument()
    })

    it("keeps the current rows when a background refresh fails", async () => {
      mocks.fetchActionSessions
        .mockResolvedValueOnce(response)
        .mockRejectedValueOnce(new Error("boom"))
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {})

      const { findInTable, table } = renderPage()
      await findInTable("Support agent")

      notify()

      await waitFor(() => expect(queries()).toHaveLength(2))
      await settle()
      expect(table().getByText("Support agent")).toBeInTheDocument()
      expect(
        screen.queryByRole("button", { name: "Try again" })
      ).not.toBeInTheDocument()
      errorSpy.mockRestore()
    })

    it("shows new sessions on the first page after going back to it", async () => {
      mocks.fetchActionSessions
        .mockResolvedValueOnce(
          pageResponse({
            assetLabel: "First page",
            pagination: {
              hasNextPage: true,
              hasPreviousPage: false,
              nextBookmark: "next-1",
            },
          })
        )
        .mockResolvedValueOnce(
          pageResponse({
            assetLabel: "Second page",
            pagination: {
              hasNextPage: false,
              hasPreviousPage: true,
              previousBookmark: "prev-2",
            },
          })
        )
        .mockResolvedValueOnce(
          pageResponse({
            assetLabel: "First page again",
            pagination: {
              hasNextPage: true,
              hasPreviousPage: false,
              nextBookmark: "next-1",
            },
          })
        )
        .mockResolvedValueOnce(
          pageResponse({
            assetLabel: "New session",
            pagination: {
              hasNextPage: true,
              hasPreviousPage: false,
              nextBookmark: "next-1b",
            },
          })
        )

      const { findInTable, pageButton } = renderPage()
      await findInTable("First page")
      await fireEvent.click(pageButton("next")!)
      await findInTable("Second page")
      await fireEvent.click(pageButton("prev")!)
      await findInTable("First page again")

      notify()

      await findInTable("New session")
      expect(queries().at(-1)?.bookmark).toBeUndefined()
      expect(pageButton("prev")).toHaveClass("is-disabled")
    })

    it("returns to the first page when a refresh empties a later page", async () => {
      mocks.fetchActionSessions
        .mockResolvedValueOnce(
          pageResponse({
            assetLabel: "First page",
            pagination: {
              hasNextPage: true,
              hasPreviousPage: false,
              nextBookmark: "next-1",
            },
          })
        )
        .mockResolvedValueOnce(
          pageResponse({
            assetLabel: "Second page",
            pagination: {
              hasNextPage: false,
              hasPreviousPage: true,
              previousBookmark: "prev-2",
            },
          })
        )
        .mockResolvedValueOnce({
          ...response,
          sessions: [],
          pagination: { hasNextPage: false, hasPreviousPage: false },
        })
        .mockResolvedValueOnce(
          pageResponse({
            assetLabel: "Moved to first page",
            pagination: {
              hasNextPage: true,
              hasPreviousPage: false,
              nextBookmark: "next-1b",
            },
          })
        )

      const { findInTable, pageButton } = renderPage()
      await findInTable("First page")
      await fireEvent.click(pageButton("next")!)
      await findInTable("Second page")

      notify()

      await findInTable("Moved to first page")
      expect(screen.getByText("Page 1")).toBeInTheDocument()
      expect(queries().map(query => query.bookmark)).toEqual([
        undefined,
        "next-1",
        "next-1",
        undefined,
      ])
    })

    it("refreshes when the socket reconnects", async () => {
      mocks.fetchActionSessions.mockResolvedValue(response)

      const { findInTable } = renderPage()
      await findInTable("Support agent")

      socket.trigger("connect")

      await waitFor(() => expect(queries()).toHaveLength(2))
    })

    it("stops listening and drops queued refreshes when unmounted", async () => {
      const initial = deferred<FetchActionSessionsResponse>()
      mocks.fetchActionSessions
        .mockReturnValueOnce(initial.promise)
        .mockResolvedValue(response)

      const { unmount } = renderPage()
      notify()
      unmount()
      initial.resolve(response)

      await settle()
      expect(queries()).toHaveLength(1)
      expect(socket.listenerCount(BuilderSocketEvent.ActionSessionChange)).toBe(
        0
      )
      expect(socket.listenerCount("connect")).toBe(0)
    })
  })
})
