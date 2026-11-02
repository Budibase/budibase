import { get } from "svelte/store"
import type { GetGlobalSelfResponse } from "@budibase/types"
import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("@/api", () => ({ API: {} }))
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
})
