import { get } from "svelte/store"
import type { GetGlobalSelfResponse } from "@budibase/types"
import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({
  setInitInfo: vi.fn(async () => ({ message: "Init info updated." })),
}))

vi.mock("@/api", () => ({ API: { setInitInfo: mocks.setInitInfo } }))
vi.mock("@/analytics", () => ({
  default: {
    activate: vi.fn(async () => {}),
    identify: vi.fn(),
  },
}))
vi.mock("@/stores/preferences", () => ({
  userPreferences: { syncDefaultLayout: vi.fn() },
}))
vi.mock("@/stores/builder", () => ({ reset: vi.fn() }))
vi.mock("./admin", () => ({ admin: {} }))

import { auth } from "./auth"

const user = {
  _id: "us_test",
  tenantId: "tenant_test",
  email: "builder@example.com",
  roles: {},
  license: {},
  budibaseAccess: true,
  accountPortalAccess: true,
  csrfToken: "csrf",
} as GetGlobalSelfResponse

describe("portal auth store", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    auth.clearInitInfoState()
  })

  it("preserves template intent when user details refresh", () => {
    auth.update(state => ({
      ...state,
      initInfo: { projectTemplate: { templateKey: "project/support" } },
    }))

    auth.setUser(user)

    expect(get(auth).initInfo).toEqual({
      projectTemplate: { templateKey: "project/support" },
    })
  })

  it("clears template intent when the session is invalidated", () => {
    auth.update(state => ({
      ...state,
      initInfo: { projectTemplate: { templateKey: "project/support" } },
    }))

    auth.clearSession()

    expect(get(auth).initInfo).toEqual({})
  })

  it("conditionally clears the matching template intent", async () => {
    auth.update(state => ({
      ...state,
      initInfo: { projectTemplate: { templateKey: "project/support" } },
    }))

    await auth.clearProjectTemplateIntent({ templateKey: "project/support" })

    expect(mocks.setInitInfo).toHaveBeenCalledWith({
      clearProjectTemplate: { templateKey: "project/support" },
    })
    expect(get(auth).initInfo).toEqual({})
  })

  it("preserves a newer local intent when an earlier clear finishes", async () => {
    let resolveClear!: (_response: { message: string }) => void
    mocks.setInitInfo.mockReturnValueOnce(
      new Promise(resolve => {
        resolveClear = resolve
      })
    )
    auth.update(state => ({
      ...state,
      initInfo: { projectTemplate: { templateKey: "project/support" } },
    }))

    const clearing = auth.clearProjectTemplateIntent({
      templateKey: "project/support",
    })
    auth.update(state => ({
      ...state,
      initInfo: { projectTemplate: { templateKey: "project/finance" } },
    }))
    resolveClear({ message: "Init info updated." })
    await clearing

    expect(get(auth).initInfo).toEqual({
      projectTemplate: { templateKey: "project/finance" },
    })
  })

  it("retains the matching intent if its cookie cannot be cleared", async () => {
    mocks.setInitInfo.mockRejectedValueOnce(new Error("unavailable"))
    auth.update(state => ({
      ...state,
      initInfo: { projectTemplate: { templateKey: "project/support" } },
    }))

    await expect(
      auth.clearProjectTemplateIntent({ templateKey: "project/support" })
    ).rejects.toThrow("unavailable")

    expect(get(auth).initInfo).toEqual({
      projectTemplate: { templateKey: "project/support" },
    })
  })
})
