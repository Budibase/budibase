import { render, waitFor } from "@testing-library/svelte"
import { get } from "svelte/store"
import { beforeEach, describe, expect, it, vi } from "vitest"
import MockSlot from "@/test/mocks/MockSlot.svelte"
import { params } from "@roxi/routify"
import { API } from "@/api"
import {
  initialise,
  reset,
  screenStore,
  workspaceStore,
} from "@/stores/builder"
import WorkspaceLayout from "./_layout.workspace.svelte"

vi.mock("@roxi/routify", async () => {
  const { writable } = await import("svelte/store")
  return { params: writable({}), goto: writable(vi.fn()) }
})

vi.mock("@budibase/shared-core", () => ({
  sdk: { users: { isAdmin: () => false, canCreateApps: () => false } },
}))

vi.mock("@budibase/bbui", () => ({
  Heading: MockSlot,
  Layout: MockSlot,
  Body: MockSlot,
  notifications: { error: vi.fn() },
}))

vi.mock("@/api", () => ({ API: { fetchAppPackage: vi.fn() } }))

vi.mock("@/stores/builder", async () => {
  const { writable } = await import("svelte/store")
  const workspaceStore = writable({ appId: "", hasAppPackage: false })
  return {
    workspaceStore,
    initialise: vi.fn(),
    reset: vi.fn(() => workspaceStore.set({ appId: "", hasAppPackage: false })),
    builderStore: writable({ created: false }),
    previewStore: {
      ...writable({ showPreview: false }),
      setUpdatingAppPackage: vi.fn(),
    },
    deploymentStore: { load: vi.fn() },
    componentStore: writable({}),
    screenStore: { ...writable({ screens: [] }), syncAppScreens: vi.fn() },
  }
})

vi.mock("@/stores/portal", async () => {
  const { writable } = await import("svelte/store")
  return {
    workspacesStore: { load: vi.fn() },
    admin: writable({ maintenance: [] }),
    aiConfigsStore: { init: vi.fn() },
    auth: writable({ user: {} }),
  }
})

vi.mock("@/stores/bb", async () => {
  const { writable } = await import("svelte/store")
  return { bb: writable({ settings: { open: false } }) }
})

vi.mock("./_components/SideNav/SideNav.svelte", () => ({ default: MockSlot }))
vi.mock("./_components/InviteUsersModal.svelte", () => ({ default: MockSlot }))
vi.mock("./_components/PreviewOverlay.svelte", () => ({ default: MockSlot }))
vi.mock("@/components/projects/ProjectSetupBackButton.svelte", () => ({
  default: MockSlot,
}))

describe("Workspace initialization", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    workspaceStore.set({ appId: "", hasAppPackage: false })
    params.set({ screenId: "screen_first" })
    API.fetchAppPackage.mockResolvedValue({ screens: [] })
    initialise.mockImplementation(async () => {
      workspaceStore.update(state => ({ ...state, hasAppPackage: true }))
    })
  })

  it("retries failed hydration before synchronizing later screen changes", async () => {
    initialise.mockImplementationOnce(async () => {
      workspaceStore.update(state => ({ ...state, hasAppPackage: true }))
      throw new Error("Hydration failed")
    })
    const view = render(WorkspaceLayout, { workspaceId: "app_first" })
    await view.findByText("Hydration failed")

    params.set({ screenId: "screen_second" })
    await waitFor(() => expect(initialise).toHaveBeenCalledTimes(2))
    params.set({ screenId: "screen_third" })
    await waitFor(() =>
      expect(screenStore.syncAppScreens).toHaveBeenCalledWith(
        { screens: [] },
        "screen_third"
      )
    )

    expect(initialise).toHaveBeenLastCalledWith(
      { screens: [] },
      "screen_second"
    )
  })

  it("initializes again after changing workspaces", async () => {
    const view = render(WorkspaceLayout, { workspaceId: "app_first" })
    await waitFor(() => expect(initialise).toHaveBeenCalledTimes(1))
    await view.rerender({ workspaceId: "app_second" })
    await waitFor(() => expect(initialise).toHaveBeenCalledTimes(2))

    expect(get(workspaceStore).appId).toBe("app_second")
    expect(reset).toHaveBeenCalledTimes(2)
    expect(screenStore.syncAppScreens).not.toHaveBeenCalled()
  })
})
