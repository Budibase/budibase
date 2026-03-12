import { render, screen } from "@testing-library/svelte"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { Constants } from "@budibase/frontend-core"
import type { User } from "@budibase/types"
const { authStore, rolesStore, usersMock } = vi.hoisted(() => {
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

  return {
    authStore: createStore({
      user: {
        _id: "user-current",
      },
    }),
    rolesStore: createStore([] as any[]),
    usersMock: {
      get: vi.fn(),
      save: vi.fn(),
      addUserToWorkspace: vi.fn(),
      removeUserFromWorkspace: vi.fn(),
      getUserRole: vi.fn(),
    },
  }
})

vi.mock("@budibase/bbui", async () => {
  const [
    { default: MockInput },
    { default: MockLayout },
    { default: MockModalContent },
    { default: MockSelect },
  ] = await Promise.all([
    import("@/test/mocks/MockInput.svelte"),
    import("@/test/mocks/MockLayout.svelte"),
    import("@/test/mocks/MockModalContent.svelte"),
    import("@/test/mocks/MockSelect.svelte"),
  ])

  return {
    Input: MockInput,
    Layout: MockLayout,
    ModalContent: MockModalContent,
    Select: MockSelect,
    Helpers: {
      uuid: vi.fn(() => "session-id"),
    },
    keepOpen: Symbol("keepOpen"),
    notifications: {
      success: vi.fn(),
      error: vi.fn(),
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

vi.mock("@/stores/builder", () => ({
  roles: rolesStore,
}))

vi.mock("@/stores/portal", () => ({
  auth: authStore,
  users: usersMock,
}))

vi.mock("../roleUtils", () => ({
  getRoleFlags: vi.fn(() => ({
    admin: { global: false },
    builder: { global: false, creator: false, apps: [] },
  })),
}))

import EditWorkspaceUserModal from "./EditWorkspaceUserModal.svelte"

const buildUser = (overrides: Partial<User> = {}): User =>
  ({
    _id: "user-1",
    _rev: "rev-1",
    tenantId: "tenant-1",
    email: "user@example.com",
    firstName: "Casey",
    lastName: "Rowan",
    roles: { app_1: Constants.Roles.BASIC },
    admin: { global: false },
    builder: { global: false, creator: false, apps: [] },
    ...overrides,
  }) as User

describe("EditWorkspaceUserModal", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    authStore.set({ user: { _id: "user-current" } })
    rolesStore.set([
      {
        _id: Constants.Roles.BASIC,
        name: "Basic",
        uiMetadata: { displayName: "Basic user", color: "#111111" },
      },
      {
        _id: Constants.Roles.ADMIN,
        name: "Admin",
        uiMetadata: { displayName: "Admin user", color: "#222222" },
      },
    ])
    usersMock.getUserRole.mockReturnValue(Constants.BudibaseRoles.AppUser)
  })

  it("keeps synced user identity fields read-only while leaving role fields editable", () => {
    render(EditWorkspaceUserModal, {
      props: {
        user: buildUser({
          scimInfo: { isSync: true },
        }),
        workspaceId: "app_1",
      },
    })

    expect(screen.getByLabelText("Email")).toHaveAttribute("readonly")
    expect(screen.getByLabelText("First name")).toBeDisabled()
    expect(screen.getByLabelText("Last name")).toBeDisabled()
    expect(screen.getByLabelText("Select role")).not.toBeDisabled()
    expect(screen.getByLabelText("Select end user role")).not.toBeDisabled()
  })

  it("allows non-scim users to edit identity and role fields", () => {
    render(EditWorkspaceUserModal, {
      props: {
        user: buildUser(),
        workspaceId: "app_1",
      },
    })

    expect(screen.getByLabelText("First name")).not.toBeDisabled()
    expect(screen.getByLabelText("Last name")).not.toBeDisabled()
    expect(screen.getByLabelText("Select role")).not.toBeDisabled()
    expect(screen.getByLabelText("Select end user role")).not.toBeDisabled()
  })
})
