import { API } from "@/api"
import { GetGlobalSelfResponse } from "@budibase/types"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { auth, licensing } from "@/stores/portal"
import { groups } from "./groups"

vi.mock("@/api", () => {
  return {
    API: {
      getGroups: vi.fn(),
    },
  }
})

vi.mock("@budibase/shared-core", async importOriginal => {
  const original =
    await importOriginal<typeof import("@budibase/shared-core")>()
  return {
    ...original,
    sdk: {
      ...original.sdk,
      users: {
        ...original.sdk.users,
        hasBuilderPermissions: vi.fn(
          (user?: { builder?: { global?: boolean } }) => !!user?.builder?.global
        ),
        hasAdminPermissions: vi.fn(
          (user?: { admin?: { global?: boolean } }) => !!user?.admin?.global
        ),
      },
    },
  }
})

vi.mock("@/stores/portal", async () => {
  const { writable } = await import("svelte/store")

  return {
    auth: writable({ user: undefined }),
    licensing: writable({ groupsEnabled: false }),
  }
})

const getGroups = vi.mocked(API.getGroups)

const setGroupsEnabled = (groupsEnabled: boolean) => {
  licensing.update(state => ({
    ...state,
    groupsEnabled,
  }))
}

const setUser = (user?: GetGlobalSelfResponse) => {
  auth.update(state => ({
    ...state,
    user,
  }))
}

describe("portal groups store", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    groups.set([])
    setGroupsEnabled(false)
    setUser()
  })

  it("does not fetch groups for non-builder users when groups are licensed", async () => {
    setUser({
      builder: { global: false },
      admin: { global: false },
      roles: {},
    } as GetGlobalSelfResponse)
    setGroupsEnabled(true)
    getGroups.mockRejectedValue(
      new Error("Non-builder users cannot fetch groups")
    )

    await expect(groups.init()).resolves.toBeUndefined()

    expect(getGroups).not.toHaveBeenCalled()
  })
})
