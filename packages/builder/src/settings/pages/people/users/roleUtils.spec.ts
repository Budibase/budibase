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

  it.each([
    Constants.BudibaseRoles.Developer,
    Constants.BudibaseRoles.Creator,
    Constants.BudibaseRoles.AppUser,
    Constants.BudibaseRoles.Owner,
  ])("does not sync global role for %s invites", role => {
    const user: User = {
      admin: { global: false },
      builder: { global: false },
    } as User

    expect(shouldSyncGlobalRole(role, user)).toBe(false)
  })

  it.each([
    [
      Constants.BudibaseRoles.Admin,
      { admin: { global: true }, builder: { global: true } },
    ],
    [
      Constants.BudibaseRoles.Developer,
      { admin: { global: false }, builder: { global: true } },
    ],
    [
      Constants.BudibaseRoles.Creator,
      {
        admin: { global: false },
        builder: { global: false, creator: true, apps: [] },
      },
    ],
    [
      Constants.BudibaseRoles.AppUser,
      {
        admin: { global: false },
        builder: { global: false, creator: false, apps: [] },
      },
    ],
    [
      Constants.BudibaseRoles.Owner,
      { admin: { global: true }, builder: { global: true } },
    ],
  ])("returns expected role flags for %s", (role, expected) => {
    expect(getRoleFlags(role)).toEqual(expected)
  })

  it("retains creator app access from the current user", () => {
    const user: User = {
      builder: { apps: ["app-a", "app-b"] },
    } as User

    expect(getRoleFlags(Constants.BudibaseRoles.Creator, user)).toEqual({
      admin: { global: false },
      builder: { global: false, creator: true, apps: ["app-a", "app-b"] },
    })
  })
})
