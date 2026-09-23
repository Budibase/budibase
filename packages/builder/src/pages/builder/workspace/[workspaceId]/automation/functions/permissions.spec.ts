import type { UserAdminInfo, UserBuilderInfo } from "@budibase/types"
import { describe, expect, it } from "vitest"
import { canManageFunctions } from "./permissions"

type PermissionUser = UserBuilderInfo & UserAdminInfo

describe("canManageFunctions", () => {
  it("allows global builders", () => {
    const user: PermissionUser = { builder: { global: true } }

    expect(canManageFunctions(user, "app_dev_one")).toBe(true)
  })

  it("allows builders assigned to the workspace", () => {
    const user: PermissionUser = {
      builder: { apps: ["app_one"] },
    }

    expect(canManageFunctions(user, "app_dev_one")).toBe(true)
  })

  it("allows global admins", () => {
    const user: PermissionUser = { admin: { global: true } }

    expect(canManageFunctions(user, "app_dev_one")).toBe(true)
  })

  it("rejects users without automation authoring access", () => {
    expect(canManageFunctions({}, "app_dev_one")).toBe(false)
    expect(canManageFunctions(undefined, "app_dev_one")).toBe(false)
  })
})
