import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/svelte"
import { beforeEach, describe, expect, it, vi } from "vitest"
import type {
  GroupUser,
  SearchUserGroupResponse,
  UserGroup,
} from "@budibase/types"
import MockButton from "@/test/mocks/MockButton.svelte"
import MockIcon from "@/test/mocks/MockIcon.svelte"
import MockLayout from "@/test/mocks/MockLayout.svelte"
import MockSearch from "@/test/mocks/MockSearch.svelte"
import MockSlot from "@/test/mocks/MockSlot.svelte"

const { getGroupUsers } = vi.hoisted(() => ({
  getGroupUsers: vi.fn<() => Promise<SearchUserGroupResponse>>(),
}))

vi.mock("@budibase/bbui", async importOriginal => {
  const actual = await importOriginal<typeof import("@budibase/bbui")>()
  return {
    ...actual,
    ActionButton: MockButton,
    Button: MockButton,
    Heading: MockLayout,
    Icon: MockIcon,
    Layout: MockLayout,
    Modal: MockSlot,
    Pagination: MockLayout,
    Popover: MockSlot,
    ProgressCircle: MockIcon,
    Search: MockSearch,
  }
})

vi.mock("@/api", () => ({
  API: {
    getGroupUsers,
    searchUsers: vi.fn().mockResolvedValue({
      data: [
        { _id: "user-1", email: "alice@example.com" },
        { _id: "user-2", email: "bob@example.com" },
      ],
    }),
  },
}))

vi.mock("@/stores/portal/groups", async () => {
  const { writable } = await import("svelte/store")
  return {
    groups: {
      ...writable<UserGroup[]>([]),
      addUser: vi.fn().mockResolvedValue(undefined),
      removeUser: vi.fn().mockResolvedValue(undefined),
    },
  }
})

vi.mock("@/stores/portal/auth", async () => {
  const { writable } = await import("svelte/store")
  return { auth: writable({ user: { admin: { global: true } } }) }
})

vi.mock("@/stores/bb", () => ({ bb: { settings: vi.fn() } }))

vi.mock("./BulkAddUsersModal.svelte", () => ({ default: MockLayout }))

import { groups } from "@/stores/portal/groups"
import GroupUsers from "./GroupUsers.svelte"

const alice: GroupUser = { _id: "user-1", email: "alice@example.com" }
const bob: GroupUser = { _id: "user-2", email: "bob@example.com" }

const deferredPage = () => {
  let resolve: (response: SearchUserGroupResponse) => void = () => {}
  const promise = new Promise<SearchUserGroupResponse>(pageResolve => {
    resolve = pageResolve
  })
  return { promise, resolve }
}

const getTable = () =>
  within(document.querySelector<HTMLElement>(".spectrum-Table")!)

describe("group users table refresh", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getGroupUsers.mockReset()
    groups.set([
      {
        _id: "group-1",
        name: "Group",
        icon: "users",
        color: "blue",
        users: [alice],
      },
    ])
  })

  it("keeps existing users visible while assigning a user and updates when refreshed", async () => {
    const page = deferredPage()
    getGroupUsers
      .mockResolvedValueOnce({ users: [alice], bookmark: "" })
      .mockReturnValueOnce(page.promise)

    render(GroupUsers, { props: { groupId: "group-1", readonly: false } })
    await getTable().findByText(alice.email)

    await fireEvent.click(await screen.findByText(bob.email))
    await waitFor(() => expect(getGroupUsers).toHaveBeenCalledTimes(2))

    expect(getTable().getByText(alice.email)).toBeInTheDocument()

    page.resolve({ users: [alice, bob], bookmark: "" })
    await getTable().findByText(bob.email)
    expect(getTable().getByText(alice.email)).toBeInTheDocument()
    expect(groups.addUser).toHaveBeenCalledWith("group-1", bob._id)
  })

  it("keeps existing users visible while removing a user through the picker", async () => {
    const page = deferredPage()
    getGroupUsers
      .mockResolvedValueOnce({ users: [alice, bob], bookmark: "" })
      .mockReturnValueOnce(page.promise)

    render(GroupUsers, { props: { groupId: "group-1", readonly: false } })
    await getTable().findByText(bob.email)

    const picker = within(document.querySelector<HTMLElement>(".items")!)
    await fireEvent.click(await picker.findByText(alice.email))
    await waitFor(() => expect(getGroupUsers).toHaveBeenCalledTimes(2))

    expect(getTable().getByText(alice.email)).toBeInTheDocument()
    expect(getTable().getByText(bob.email)).toBeInTheDocument()

    page.resolve({ users: [bob], bookmark: "" })
    await waitFor(() =>
      expect(getTable().queryByText(alice.email)).not.toBeInTheDocument()
    )
    expect(getTable().getByText(bob.email)).toBeInTheDocument()
    expect(groups.removeUser).toHaveBeenCalledWith("group-1", alice._id)
  })

  it("keeps other users visible while refreshing after the Remove button is clicked", async () => {
    const page = deferredPage()
    getGroupUsers
      .mockResolvedValueOnce({ users: [alice, bob], bookmark: "" })
      .mockReturnValueOnce(page.promise)

    render(GroupUsers, { props: { groupId: "group-1", readonly: false } })
    await getTable().findByText(bob.email)

    await fireEvent.click(getTable().getAllByText("Remove")[0])
    await waitFor(() => expect(getGroupUsers).toHaveBeenCalledTimes(2))

    expect(getTable().getByText(alice.email)).toBeInTheDocument()
    expect(getTable().getByText(bob.email)).toBeInTheDocument()

    page.resolve({ users: [bob], bookmark: "" })
    await waitFor(() =>
      expect(getTable().queryByText(alice.email)).not.toBeInTheDocument()
    )
    expect(getTable().getByText(bob.email)).toBeInTheDocument()
    expect(groups.removeUser).toHaveBeenCalledWith("group-1", alice._id)
  })

  it("keeps pagination visible while the first page refreshes after selecting a user", async () => {
    const page = deferredPage()
    getGroupUsers
      .mockResolvedValueOnce({
        users: [alice],
        bookmark: "page-2",
        hasNextPage: true,
      })
      .mockReturnValueOnce(page.promise)

    const { container } = render(GroupUsers, {
      props: { groupId: "group-1", readonly: false },
    })
    await getTable().findByText(alice.email)

    await fireEvent.click(await screen.findByText(bob.email))
    await waitFor(() => expect(getGroupUsers).toHaveBeenCalledTimes(2))

    expect(container.querySelector(".pagination")).toBeInTheDocument()
    expect(container.querySelectorAll(".spectrum-Table-row")).toHaveLength(5)

    page.resolve({ users: [alice, bob], bookmark: "" })
    await getTable().findByText(bob.email)
    expect(container.querySelector(".pagination")).not.toBeInTheDocument()
    expect(container.querySelectorAll(".spectrum-Table-row")).toHaveLength(2)
  })
})
