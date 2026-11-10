import { fireEvent, render, screen, waitFor } from "@testing-library/svelte"
import { beforeEach, describe, expect, it, vi } from "vitest"
import type {
  SearchUsersRequest,
  SearchUsersResponse,
  StrippedUser,
} from "@budibase/types"
import MockButton from "@/test/mocks/MockButton.svelte"
import MockIcon from "@/test/mocks/MockIcon.svelte"
import MockLayout from "@/test/mocks/MockLayout.svelte"
import MockSearch from "@/test/mocks/MockSearch.svelte"
import MockSlot from "@/test/mocks/MockSlot.svelte"

const { searchUsers } = vi.hoisted(() => ({
  searchUsers:
    vi.fn<(request: SearchUsersRequest) => Promise<SearchUsersResponse>>(),
}))

vi.mock("@budibase/bbui", () => ({
  ActionButton: MockButton,
  Button: MockButton,
  Icon: MockIcon,
  Layout: MockLayout,
  Popover: MockSlot,
  ProgressCircle: MockIcon,
  Search: MockSearch,
  notifications: { error: vi.fn() },
}))

vi.mock("@/api", () => ({
  API: { searchUsers },
}))

vi.mock("@/stores/portal/groups", async () => {
  const { writable } = await import("svelte/store")
  return {
    groups: {
      ...writable([{ _id: "group-1", users: [] }]),
      addUser: vi.fn(),
      removeUser: vi.fn(),
    },
  }
})

import { notifications } from "@budibase/bbui"
import { groups } from "@/stores/portal/groups"
import EditUserPicker from "./EditUserPicker.svelte"

const getLabels = () =>
  Array.from(document.querySelectorAll(".item .text")).map(el =>
    el.textContent?.trim()
  )

const user = (_id: string, email: string): StrippedUser => ({
  _id,
  userId: _id,
  tenantId: "default",
  email,
})

const buildUsers = ({
  prefix,
  count,
}: {
  prefix: string
  count: number
}): StrippedUser[] =>
  Array.from({ length: count }, (_, i) => ({
    _id: `${prefix}-${i}`,
    userId: `${prefix}-${i}`,
    tenantId: "default",
    email: `${prefix}${String(i).padStart(2, "0")}@example.com`,
  }))

describe("EditUserPicker", () => {
  beforeEach(() => {
    searchUsers.mockReset()
    vi.mocked(notifications.error).mockClear()
    groups.set([{ _id: "group-1", users: [] }] as any)
  })

  it("appends the next page of users to the list", async () => {
    searchUsers.mockImplementation(async ({ bookmark }) =>
      bookmark
        ? { data: buildUsers({ prefix: "page2-", count: 10 }) }
        : {
            data: buildUsers({ prefix: "page1-", count: 10 }),
            hasNextPage: true,
            nextPage: "page-2",
          }
    )

    render(EditUserPicker, {
      props: { groupId: "group-1", onUsersUpdated: vi.fn() },
    })

    await screen.findByText("page2-09@example.com")
    expect(screen.getByText("page1-00@example.com")).toBeInTheDocument()
    expect(searchUsers).toHaveBeenCalledTimes(2)
    expect(searchUsers).toHaveBeenLastCalledWith({
      bookmark: "page-2",
      query: { string: { email: "" } },
    })
  })

  it("replaces the list with the first page of results when searching", async () => {
    searchUsers.mockImplementation(async ({ query }) => {
      const prefix = query?.string?.email ? "match-" : "user-"
      return { data: buildUsers({ prefix, count: 3 }) }
    })

    render(EditUserPicker, {
      props: { groupId: "group-1", onUsersUpdated: vi.fn() },
    })
    await screen.findByText("user-00@example.com")

    await fireEvent.input(screen.getByPlaceholderText("Search"), {
      target: { value: "match" },
    })

    await screen.findByText("match-00@example.com")
    expect(screen.queryByText("user-00@example.com")).not.toBeInTheDocument()
    expect(searchUsers).toHaveBeenLastCalledWith({
      bookmark: undefined,
      query: { string: { email: "match" } },
    })
  })

  it("ignores responses from outdated searches", async () => {
    let resolveFirstSearch: (response: SearchUsersResponse) => void = () => {}
    searchUsers
      .mockImplementationOnce(
        () =>
          new Promise(resolve => {
            resolveFirstSearch = resolve
          })
      )
      .mockResolvedValueOnce({
        data: buildUsers({ prefix: "match-", count: 1 }),
      })

    render(EditUserPicker, {
      props: { groupId: "group-1", onUsersUpdated: vi.fn() },
    })
    await fireEvent.input(screen.getByPlaceholderText("Search"), {
      target: { value: "match" },
    })
    await screen.findByText("match-00@example.com")

    resolveFirstSearch({ data: buildUsers({ prefix: "stale-", count: 1 }) })

    await waitFor(() => {
      expect(screen.queryByText("stale-00@example.com")).not.toBeInTheDocument()
    })
    expect(screen.getByText("match-00@example.com")).toBeInTheDocument()
  })

  it("keeps users in fetched order across pages, including selected users", async () => {
    // IDs and emails sort differently, and the selected user is on page 2
    const firstPage = [
      user("us_z", "anna@example.com"),
      user("us_y", "beth@example.com"),
    ]
    const secondPage = [
      user("us_a", "cara@example.com"),
      user("us_b", "dina@example.com"),
    ]
    groups.set([{ _id: "group-1", users: [{ _id: "us_b" }] }] as any)
    searchUsers.mockImplementation(async ({ bookmark }) =>
      bookmark
        ? { data: secondPage }
        : { data: firstPage, hasNextPage: true, nextPage: "cara@example.com" }
    )

    render(EditUserPicker, {
      props: { groupId: "group-1", onUsersUpdated: vi.fn() },
    })

    await screen.findByText("dina@example.com")
    const fetchedOrder = [...firstPage, ...secondPage].map(u => u.email)
    expect(getLabels()).toEqual(fetchedOrder)

    // changing membership must not move rows
    groups.set([{ _id: "group-1", users: [{ _id: "us_y" }] }] as any)
    await waitFor(() => expect(getLabels()).toEqual(fetchedOrder))
  })

  it("does not retry a failed page automatically, and retries it on request", async () => {
    let failNextPage = true
    let failures = 0
    searchUsers.mockImplementation(async ({ bookmark }) => {
      if (!bookmark) {
        return {
          data: buildUsers({ prefix: "page1-", count: 2 }),
          hasNextPage: true,
          nextPage: "page-2",
        }
      }
      // capped so a retry loop fails the assertions below rather than hanging
      if (failNextPage && failures < 5) {
        failures++
        throw new Error("Service unavailable")
      }
      return { data: buildUsers({ prefix: "page2-", count: 2 }) }
    })

    render(EditUserPicker, {
      props: { groupId: "group-1", onUsersUpdated: vi.fn() },
    })

    const retryButton = await screen.findByText("Retry")
    // give any automatic reload a chance to happen
    await new Promise(resolve => setTimeout(resolve, 50))
    expect(searchUsers).toHaveBeenCalledTimes(2)
    expect(notifications.error).toHaveBeenCalledTimes(1)

    failNextPage = false
    await fireEvent.click(retryButton)

    await screen.findByText("page2-01@example.com")
    expect(searchUsers).toHaveBeenCalledTimes(3)
    expect(searchUsers).toHaveBeenLastCalledWith({
      bookmark: "page-2",
      query: { string: { email: "" } },
    })
    expect(screen.queryByText("Retry")).not.toBeInTheDocument()
    expect(notifications.error).toHaveBeenCalledTimes(1)
  })
})
