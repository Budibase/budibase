import { describe, expect, it } from "vitest"
import { Constants } from "@budibase/frontend-core"
import type { User } from "@budibase/types"
import { shouldSyncGlobalRole, getRoleFlags } from "./roleUtils"

describe("roleUtils", () => {
  it("syncs global role for tenant admin invites when user is not already admin", () => {
    const user: User = {
      admin: { global: false },
      builder: { global: false },
    } as User

    expect(shouldSyncGlobalRole(Constants.BudibaseRoles.Admin, user)).toBe(true)
  })

  it("does not sync global role for tenant admin invites when user is already admin", () => {
    const user: User = {
      admin: { global: true },
      builder: { global: true },
    } as User

    expect(shouldSyncGlobalRole(Constants.BudibaseRoles.Admin, user)).toBe(
      false
    )
  })

  it("returns global admin and builder flags for tenant admin", () => {
    expect(getRoleFlags(Constants.BudibaseRoles.Admin)).toEqual({
      admin: { global: true },
      builder: { global: true },
    })
  })
})
