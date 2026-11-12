import { get } from "svelte/store"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { auth } from "./auth"

const mocks = vi.hoisted(() => ({
  updateSelf: vi.fn(),
  fetchBuilderSelf: vi.fn(),
}))

vi.mock("@/api", () => ({
  API: {
    updateSelf: mocks.updateSelf,
    fetchBuilderSelf: mocks.fetchBuilderSelf,
  },
}))

vi.mock("@/analytics", () => ({
  default: {
    activate: vi.fn(),
    identify: vi.fn(),
  },
}))

vi.mock("@/stores/preferences", () => ({
  userPreferences: {
    syncDefaultLayout: vi.fn(),
  },
}))

vi.mock("@/stores/builder", () => ({
  reset: vi.fn(),
}))

describe("AuthStore last visited workspace", () => {
  beforeEach(() => {
    mocks.updateSelf.mockReset()
    mocks.fetchBuilderSelf.mockReset()
    auth.set({
      accountPortalAccess: false,
      tenantId: "default",
      tenantSet: false,
      loaded: false,
      postLogout: false,
      isSSO: false,
    })
  })

  it("does not clear auth state when the update fails", async () => {
    auth.update(state => ({ ...state, loaded: true, tenantSet: true }))
    mocks.updateSelf.mockRejectedValueOnce(new Error("Request failed"))

    await expect(
      auth.updateLastVisitedWorkspace("app_dev_workspace_1")
    ).rejects.toThrow("Request failed")

    expect(get(auth).loaded).toBe(true)
    expect(get(auth).tenantSet).toBe(true)
    expect(mocks.fetchBuilderSelf).not.toHaveBeenCalled()
  })

  it("persists rapid workspace visits in order", async () => {
    let resolveFirstUpdate: (() => void) | undefined
    mocks.updateSelf
      .mockImplementationOnce(
        () =>
          new Promise<void>(resolve => {
            resolveFirstUpdate = resolve
          })
      )
      .mockResolvedValueOnce(undefined)

    const firstUpdate = auth.updateLastVisitedWorkspace("app_dev_workspace_1")
    await vi.waitFor(() => expect(mocks.updateSelf).toHaveBeenCalledTimes(1))

    const secondUpdate = auth.updateLastVisitedWorkspace("app_dev_workspace_2")
    expect(mocks.updateSelf).toHaveBeenCalledTimes(1)

    resolveFirstUpdate?.()
    await Promise.all([firstUpdate, secondUpdate])

    expect(mocks.updateSelf.mock.calls).toEqual([
      [{ lastVisitedWorkspaceId: "app_dev_workspace_1" }],
      [{ lastVisitedWorkspaceId: "app_dev_workspace_2" }],
    ])
  })
})
