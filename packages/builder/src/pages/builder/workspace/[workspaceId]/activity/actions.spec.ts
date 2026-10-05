import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/svelte"
import { beforeEach, describe, expect, it, vi } from "vitest"
import type {
  FetchActionSessionsResponse,
  FetchActionSessionsQuery,
} from "@budibase/types"
import ActivityActions from "./actions.svelte"

const mocks = vi.hoisted(() => ({
  fetchActionSessions: vi.fn(),
}))

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
  const { container } = render(ActivityActions)
  const table = () =>
    within(container.querySelector<HTMLElement>(".spectrum-Table")!)
  const pageButton = (direction: "prev" | "next") =>
    container.querySelector<HTMLElement>(
      `.spectrum-Pagination-${direction}Button`
    )
  return { table, pageButton }
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
    mocks.fetchActionSessions.mockReset()
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
    ).toEqual([undefined, "next-1", "prev-2"])
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

  it("shows an empty state when there are no sessions", async () => {
    mocks.fetchActionSessions.mockResolvedValue({ ...response, sessions: [] })

    renderPage()

    await waitFor(() => {
      expect(screen.getByText("No actions tracked yet.")).toBeInTheDocument()
    })
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

  it("shows an error state and retries the request", async () => {
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
  })
})
