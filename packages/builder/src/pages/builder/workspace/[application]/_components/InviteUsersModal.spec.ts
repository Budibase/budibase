import { fireEvent, render, screen, waitFor } from "@testing-library/svelte"
import { beforeEach, describe, expect, it, vi } from "vitest"

interface SearchUser {
  _id: string
  email: string
  firstName: string
  lastName: string
}

vi.mock("svelte", async importOriginal => {
  const actual = await importOriginal<typeof import("svelte")>()
  return {
    ...actual,
    onMount: () => {},
  }
})

const {
  appStore,
  rolesStore,
  groupsStore,
  adminStore,
  organisationStore,
  licensingStore,
  usersMock,
  searchUsersMock,
  assignExistingUsersToWorkspaceMock,
} = vi.hoisted(() => {
  const createStore = <T>(initialValue: T) => {
    let value = initialValue
    const subscribers = new Set<(value: T) => void>()

    return {
      subscribe(callback: (value: T) => void) {
        callback(value)
        subscribers.add(callback)
        return () => subscribers.delete(callback)
      },
      set(nextValue: T) {
        value = nextValue
        subscribers.forEach(callback => callback(value))
      },
    }
  }

  const licensingValueStore = createStore({
    userCount: 1,
    userLimit: 100,
    license: { plan: { type: "pro" } },
    groupsEnabled: true,
  })

  const licensingStore = {
    subscribe: licensingValueStore.subscribe,
    set: licensingValueStore.set,
    usersLimitReached: vi.fn(() => false),
    usersLimitExceeded: vi.fn(() => false),
    setQuotaUsage: vi.fn(),
  }

  return {
    appStore: createStore({ appId: "app_dev_123" }),
    rolesStore: {
      ...createStore([] as any[]),
      fetch: vi.fn(),
    },
    groupsStore: createStore([] as any[]),
    adminStore: createStore({
      loaded: true,
      cloud: true,
      checklist: { smtp: { checked: true } },
    }),
    organisationStore: createStore({ isSSOEnforced: false }),
    licensingStore,
    usersMock: {
      invite: vi.fn(async () => ({ successful: [], unsuccessful: [] })),
      create: vi.fn(async () => ({ successful: [], unsuccessful: [] })),
      fetch: vi.fn(async () => []),
    },
    searchUsersMock: vi.fn(async () => ({ data: [] as SearchUser[] })),
    assignExistingUsersToWorkspaceMock: vi.fn(async (userData: any) => ({
      usersToInvite: userData.users,
      addedToWorkspaceEmails: [],
      assignedCount: 0,
      failedCount: 0,
    })),
  }
})

vi.mock("@budibase/bbui", async importOriginal => {
  const actual = await importOriginal<typeof import("@budibase/bbui")>()
  const [
    { default: MockBody },
    { default: MockInput },
    { default: MockLayout },
    { default: MockModal },
    { default: MockModalContent },
    { default: MockSelect },
  ] = await Promise.all([
    import("@/test/mocks/MockBody.svelte"),
    import("@/test/mocks/MockInput.svelte"),
    import("@/test/mocks/MockLayout.svelte"),
    import("@/test/mocks/MockModal.svelte"),
    import("@/test/mocks/MockModalContent.svelte"),
    import("@/test/mocks/MockSelect.svelte"),
  ])

  return {
    keepOpen: Symbol("keepOpen"),
    ActionButton: MockBody,
    Icon: MockBody,
    InputDropdown: MockInput,
    Label: MockBody,
    Layout: MockLayout,
    Modal: MockModal,
    ModalContent: MockModalContent,
    Multiselect: MockSelect,
    PillInput: actual.PillInput,
    RadioGroup: MockSelect,
    Select: MockSelect,
    Avatar: MockBody,
    Helpers: {
      uuid: vi.fn(() => "session-id"),
    },
    notifications: {
      success: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
    },
  }
})

vi.mock("@/components/common/GlobalRoleSelect.svelte", async () => {
  const { default: MockGlobalRoleSelect } = await import(
    "@/test/mocks/MockGlobalRoleSelect.svelte"
  )

  return {
    default: MockGlobalRoleSelect,
  }
})

vi.mock("@/api", () => ({
  API: {
    searchUsers: searchUsersMock,
  },
}))

vi.mock(
  "@/settings/pages/people/users/_components/InvitedModal.svelte",
  async () => {
    const { default: MockBody } = await import("@/test/mocks/MockBody.svelte")
    return {
      default: MockBody,
    }
  }
)

vi.mock(
  "@/settings/pages/people/users/_components/PasswordModal.svelte",
  async () => {
    const { default: MockBody } = await import("@/test/mocks/MockBody.svelte")
    return {
      default: MockBody,
    }
  }
)

vi.mock("@/stores/builder", () => ({
  appStore,
  roles: rolesStore,
}))

vi.mock("@/stores/portal/groups", () => ({
  groups: groupsStore,
}))

vi.mock("@/stores/portal/admin", () => ({
  admin: adminStore,
}))

vi.mock("@/stores/portal/organisation", () => ({
  organisation: organisationStore,
}))

vi.mock("@/stores/portal/licensing", () => ({
  licensing: licensingStore,
}))

vi.mock("@/stores/portal", () => ({
  users: usersMock,
}))

vi.mock("@budibase/shared-core", async importOriginal => {
  const actual = await importOriginal<typeof import("@budibase/shared-core")>()
  return {
    ...actual,
    sdk: {
      ...actual.sdk,
      applications: {
        ...actual.sdk.applications,
        getProdAppID: (appId: string) => appId.replace("app_dev_", "app_"),
      },
    },
  }
})

vi.mock("@/settings/pages/people/users/workspaceInviteUtils", () => ({
  assignCreatedUsersToWorkspace: vi.fn(async () => ({
    addedToWorkspaceEmails: [],
    assignedCount: 0,
    failedCount: 0,
  })),
  assignExistingUsersToWorkspace: assignExistingUsersToWorkspaceMock,
  buildWorkspaceInvitePayload: vi.fn(() => []),
  dedupeUsersByEmail: vi.fn((userData: any) => userData),
}))

import InviteUsersModal from "./InviteUsersModal.svelte"

describe("InviteUsersModal", () => {
  const getEmailInput = () => screen.getByRole("textbox")

  beforeEach(() => {
    vi.clearAllMocks()
    appStore.set({ appId: "app_dev_123" })
    groupsStore.set([])
    adminStore.set({
      loaded: true,
      cloud: true,
      checklist: { smtp: { checked: true } },
    })
    organisationStore.set({ isSSOEnforced: false })
    licensingStore.set({
      userCount: 1,
      userLimit: 100,
      license: { plan: { type: "pro" } },
      groupsEnabled: true,
    })
    licensingStore.usersLimitReached.mockReturnValue(false)
    licensingStore.usersLimitExceeded.mockReturnValue(false)
    searchUsersMock.mockResolvedValue({ data: [] })
  })

  it("keeps invite action disabled when no emails are entered", () => {
    render(InviteUsersModal, { props: { onHide: vi.fn() } })

    expect(screen.getByRole("button", { name: "Invite users" })).toBeDisabled()
  })

  it("enables invite action when a valid first email is typed", async () => {
    render(InviteUsersModal, { props: { onHide: vi.fn() } })

    await fireEvent.input(getEmailInput(), {
      target: { value: "test@example.com" },
    })

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Invite users" })).toBeEnabled()
    })
  })

  it("does not enable invite action when the first email is typed is invalid", async () => {
    render(InviteUsersModal, { props: { onHide: vi.fn() } })

    await fireEvent.input(getEmailInput(), {
      target: { value: "inprogress@example." },
    })

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Invite users" })
      ).toBeDisabled()
    })
  })

  it("keeps the invite action button enabled when a second invalid email is typed, if the first email is valid", async () => {
    render(InviteUsersModal, { props: { onHide: vi.fn() } })

    await fireEvent.input(getEmailInput(), {
      target: { value: "test@example.com," },
    })
    await fireEvent.input(getEmailInput(), {
      target: { value: "inprogress@" },
    })

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Invite users" })).toBeEnabled()
    })
  })

  it("adds an existing user from the email suggestions", async () => {
    searchUsersMock.mockResolvedValue({
      data: [
        {
          _id: "user_1",
          email: "existing@example.com",
          firstName: "Existing",
          lastName: "User",
        },
      ],
    })
    render(InviteUsersModal, { props: { onHide: vi.fn() } })

    await fireEvent.input(getEmailInput(), {
      target: { value: "existing" },
    })

    await waitFor(() => {
      expect(screen.getByText("existing@example.com")).toBeInTheDocument()
    })

    await fireEvent.mouseDown(screen.getByText("existing@example.com"))

    await waitFor(() => {
      expect(searchUsersMock).toHaveBeenCalledWith({
        query: { fuzzy: { email: "existing" } },
        limit: 8,
      })
      expect(screen.getByText("existing@example.com")).toBeInTheDocument()
      expect(screen.getByRole("button", { name: "Invite users" })).toBeEnabled()
    })
  })

  it("shows an already selected suggested user as disabled", async () => {
    searchUsersMock.mockResolvedValue({
      data: [
        {
          _id: "user_1",
          email: "existing@example.com",
          firstName: "Existing",
          lastName: "User",
        },
      ],
    })
    render(InviteUsersModal, { props: { onHide: vi.fn() } })

    await fireEvent.input(getEmailInput(), {
      target: { value: "existing" },
    })

    await waitFor(() => {
      expect(screen.getByText("existing@example.com")).toBeInTheDocument()
    })

    await fireEvent.mouseDown(screen.getByText("existing@example.com"))
    await fireEvent.input(getEmailInput(), {
      target: { value: "existing" },
    })

    await waitFor(() => {
      expect(
        screen.getByRole("option", {
          name: /Existing User existing@example.com/,
        })
      ).toBeDisabled()
    })
  })

  it("adds the highlighted suggested user when tab is pressed", async () => {
    searchUsersMock.mockResolvedValue({
      data: [
        {
          _id: "user_1",
          email: "first@example.com",
          firstName: "First",
          lastName: "User",
        },
        {
          _id: "user_2",
          email: "second@example.com",
          firstName: "Second",
          lastName: "User",
        },
      ],
    })
    render(InviteUsersModal, { props: { onHide: vi.fn() } })

    await fireEvent.input(getEmailInput(), {
      target: { value: "user" },
    })

    await waitFor(() => {
      expect(screen.getByText("first@example.com")).toBeInTheDocument()
    })

    await fireEvent.keyDown(getEmailInput(), { key: "ArrowDown" })
    await fireEvent.keyDown(getEmailInput(), { key: "Tab" })

    await waitFor(() => {
      expect(screen.getByText("second@example.com")).toBeInTheDocument()
      expect(screen.queryByText("first@example.com")).not.toBeInTheDocument()
      expect(screen.getByRole("button", { name: "Invite users" })).toBeEnabled()
    })
  })

  it("adds the highlighted suggested user when enter is pressed", async () => {
    searchUsersMock.mockResolvedValue({
      data: [
        {
          _id: "user_1",
          email: "enter@example.com",
          firstName: "Enter",
          lastName: "User",
        },
      ],
    })
    render(InviteUsersModal, { props: { onHide: vi.fn() } })

    await fireEvent.input(getEmailInput(), {
      target: { value: "enter" },
    })

    await waitFor(() => {
      expect(screen.getByText("enter@example.com")).toBeInTheDocument()
    })

    await fireEvent.keyDown(getEmailInput(), { key: "Enter" })

    await waitFor(() => {
      expect(screen.getByText("enter@example.com")).toBeInTheDocument()
      expect(screen.getByRole("button", { name: "Invite users" })).toBeEnabled()
    })
  })

  it("closes the user suggestions when the email input blurs", async () => {
    searchUsersMock.mockResolvedValue({
      data: [
        {
          _id: "user_1",
          email: "existing@example.com",
          firstName: "Existing",
          lastName: "User",
        },
      ],
    })
    render(InviteUsersModal, { props: { onHide: vi.fn() } })

    await fireEvent.input(getEmailInput(), {
      target: { value: "existing" },
    })

    await waitFor(() => {
      expect(screen.getByText("existing@example.com")).toBeInTheDocument()
    })

    await fireEvent.blur(getEmailInput())

    await waitFor(() => {
      expect(screen.queryByText("existing@example.com")).not.toBeInTheDocument()
    })
  })
})
