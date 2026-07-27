import { render, screen } from "@testing-library/svelte"
import { beforeEach, describe, expect, it, vi } from "vitest"
import type { UserGroup } from "@budibase/types"

const {
  appsStore,
  appsStoreMock,
  authStore,
  bbMock,
  groupsMock,
  groupsStore,
  rolesMock,
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

  const groupsStore = createStore([] as UserGroup[])
  const appsStore = createStore({ apps: [] as { devId: string }[] })
  const authStore = createStore({
    user: {
      admin: { global: true },
    },
  })

  const rolesMock = {
    fetch: vi.fn().mockResolvedValue(undefined),
  }
  const bbMock = {
    settings: vi.fn(),
  }
  const groupsMock = {
    subscribe: groupsStore.subscribe,
    init: vi.fn().mockResolvedValue(undefined),
    save: vi.fn().mockResolvedValue(undefined),
    delete: vi.fn().mockResolvedValue(undefined),
    removeApp: vi.fn().mockResolvedValue(undefined),
    getGroupAppIds: (group?: UserGroup) => {
      let ids = Object.keys(group?.roles || {})
      if (group?.builder?.apps) {
        ids = ids.concat(group.builder.apps)
      }
      return ids
    },
  }
  const appsStoreMock = {
    subscribe: appsStore.subscribe,
    getProdAppID: vi.fn((devId: string) => devId),
  }

  return {
    appsStore,
    appsStoreMock,
    authStore,
    bbMock,
    groupsMock,
    groupsStore,
    rolesMock,
  }
})

vi.mock("@budibase/bbui", async () => {
  const [
    { default: MockInput },
    { default: MockLayout },
    { default: MockModal },
    { default: MockToggle },
  ] = await Promise.all([
    import("@/test/mocks/MockInput.svelte"),
    import("@/test/mocks/MockLayout.svelte"),
    import("@/test/mocks/MockModal.svelte"),
    import("@/test/mocks/MockToggle.svelte"),
  ])

  return {
    ActionMenu: MockLayout,
    Heading: MockLayout,
    Icon: MockLayout,
    Layout: MockLayout,
    MenuItem: MockLayout,
    Modal: MockModal,
    Pagination: MockLayout,
    Search: MockInput,
    Table: MockLayout,
    Toggle: MockToggle,
    notifications: {
      error: vi.fn(),
      success: vi.fn(),
    },
  }
})

vi.mock("@/components/common/ConfirmDialog.svelte", async () => {
  const { default: MockLayout } = await import("@/test/mocks/MockLayout.svelte")
  return { default: MockLayout }
})

vi.mock("../users/_components/AppNameTableRenderer.svelte", async () => {
  const { default: MockLayout } = await import("@/test/mocks/MockLayout.svelte")
  return { default: MockLayout }
})

vi.mock("../users/_components/AppRoleTableRenderer.svelte", async () => {
  const { default: MockLayout } = await import("@/test/mocks/MockLayout.svelte")
  return { default: MockLayout }
})

vi.mock("./_components/CreateEditGroupModal.svelte", async () => {
  const { default: MockLayout } = await import("@/test/mocks/MockLayout.svelte")
  return { default: MockLayout }
})

vi.mock("./_components/GroupIcon.svelte", async () => {
  const { default: MockLayout } = await import("@/test/mocks/MockLayout.svelte")
  return { default: MockLayout }
})

vi.mock("./_components/GroupUsers.svelte", async () => {
  const { default: MockLayout } = await import("@/test/mocks/MockLayout.svelte")
  return { default: MockLayout }
})

vi.mock("./_components/EditWorkspaceRoleModal.svelte", async () => {
  const { default: MockLayout } = await import("@/test/mocks/MockLayout.svelte")
  return { default: MockLayout }
})

vi.mock("./_components/RemoveWorkspaceTableRenderer.svelte", async () => {
  const { default: MockLayout } = await import("@/test/mocks/MockLayout.svelte")
  return { default: MockLayout }
})

vi.mock("./_components/AssignWorkspacePicker.svelte", async () => {
  const { default: MockAssignWorkspacePicker } = await import(
    "@/test/mocks/MockAssignWorkspacePicker.svelte"
  )
  return { default: MockAssignWorkspacePicker }
})

vi.mock("@/stores/builder", () => ({
  roles: rolesMock,
}))

vi.mock("@/stores/portal/apps", () => ({
  appsStore: appsStoreMock,
}))

vi.mock("@/stores/portal/auth", () => ({
  auth: authStore,
}))

vi.mock("@/stores/portal/groups", () => ({
  groups: groupsMock,
}))

vi.mock("@/stores/bb", () => ({
  bb: bbMock,
}))

vi.mock("@budibase/shared-core", () => ({
  sdk: {
    users: {
      isAdmin: (user: any) => !!user?.admin?.global,
    },
  },
}))

vi.mock("@budibase/frontend-core", () => ({
  Constants: {
    Roles: {
      CREATOR: "CREATOR",
    },
  },
}))

import GroupPage from "./group.svelte"

const buildGroup = (overrides: Partial<UserGroup> = {}): UserGroup =>
  ({
    _id: "group_1",
    _rev: "rev_1",
    name: "Sync Group",
    users: [],
    roles: {},
    builder: { apps: [] },
    ...overrides,
  }) as UserGroup

describe("group page workspace assignment permissions", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    appsStore.set({ apps: [] })
    groupsStore.set([
      buildGroup({
        scimInfo: { isSync: true, externalId: "123" },
      }),
    ])
    authStore.set({
      user: {
        admin: { global: true },
      },
    })
  })

  const renderGroupPage = () => {
    const routingStore = {
      subscribe(callback: (value: { params: Record<string, string> }) => void) {
        callback({ params: {} })
        return () => {}
      },
    }

    render(GroupPage, {
      props: {
        groupId: "group_1",
      },
      context: new Map([["routing", routingStore]]),
    })
  }

  it("shows workspace assignment controls for synced groups when the user is admin", async () => {
    renderGroupPage()

    await screen.findByText("Workspaces")
    expect(screen.getByTestId("assign-workspace-picker")).toBeInTheDocument()
  })

  it("hides workspace assignment controls for non-admin users", async () => {
    authStore.set({
      user: {
        admin: { global: false },
      },
    })

    renderGroupPage()

    await screen.findByText("Workspaces")
    expect(
      screen.queryByTestId("assign-workspace-picker")
    ).not.toBeInTheDocument()
  })
})
