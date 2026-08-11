import { describe, expect, it } from "vitest"
import {
  getRolesAtLeastAsRestrictive,
  isRoleAtLeastAsRestrictive,
  roleInherits,
} from "./roles.js"

// Built-in chain (ADMIN -> POWER -> BASIC -> PUBLIC) plus two custom roles on a
// separate branch: Sales inherits BASIC, Manager inherits Sales. Built-in ids
// are unprefixed; custom ids carry the "role_" doc prefix, and custom parents in
// `inherits` are prefixed too - mirroring how the roles store holds them.
const roles = [
  { _id: "ADMIN", inherits: "POWER" },
  { _id: "POWER", inherits: "BASIC" },
  { _id: "BASIC", inherits: "PUBLIC" },
  { _id: "PUBLIC" },
  { _id: "role_sales", inherits: "BASIC" },
  { _id: "role_manager", inherits: "role_sales" },
]

const restrictive = parent => getRolesAtLeastAsRestrictive(parent, roles).sort()

describe("roles inheritance", () => {
  describe("roleInherits", () => {
    const byId = Object.fromEntries(roles.map(r => [r._id, r]))

    it("is true for the same role", () => {
      expect(roleInherits("BASIC", "BASIC", byId)).toBe(true)
    })

    it("follows a built-in chain toward ancestors", () => {
      expect(roleInherits("ADMIN", "BASIC", byId)).toBe(true)
      expect(roleInherits("POWER", "PUBLIC", byId)).toBe(true)
    })

    it("does not walk toward descendants", () => {
      expect(roleInherits("BASIC", "ADMIN", byId)).toBe(false)
    })

    it("connects a custom role to the built-in it inherits", () => {
      expect(roleInherits("role_sales", "BASIC", byId)).toBe(true)
      expect(roleInherits("role_manager", "role_sales", byId)).toBe(true)
      expect(roleInherits("role_manager", "BASIC", byId)).toBe(true)
    })

    it("keeps separate branches separate", () => {
      // Power is a built-in branch, unrelated to the custom Sales branch.
      expect(roleInherits("POWER", "role_sales", byId)).toBe(false)
      expect(roleInherits("role_sales", "POWER", byId)).toBe(false)
    })

    it("tolerates the role_ prefix on either side", () => {
      expect(roleInherits("sales", "role_sales", byId)).toBe(true)
    })

    it("terminates on inheritance cycles and returns false", () => {
      const cyclic = {
        role_a: { _id: "role_a", inherits: "role_b" },
        role_b: { _id: "role_b", inherits: "role_a" },
      }
      expect(roleInherits("role_a", "BASIC", cyclic)).toBe(false)
    })

    it("follows array (multi parent) inheritance", () => {
      const multi = {
        ...byId,
        role_multi: { _id: "role_multi", inherits: ["POWER", "role_sales"] },
      }
      expect(roleInherits("role_multi", "role_sales", multi)).toBe(true)
      expect(roleInherits("role_multi", "POWER", multi)).toBe(true)
      expect(roleInherits("role_multi", "ADMIN", multi)).toBe(false)
    })
  })

  describe("mixed prefix spellings", () => {
    // The roles API externalises a role's _id without its version but its
    // `inherits` with it (backend-core externalRole), so the same role can
    // arrive with a prefixed _id and unprefixed parents. A chain three deep
    // then needs a lookup by an unprefixed id against a prefixed key.
    const mixed = [
      { _id: "BASIC", inherits: "PUBLIC" },
      { _id: "PUBLIC" },
      { _id: "role_staff", inherits: "BASIC" },
      { _id: "role_sales", inherits: "staff" },
      { _id: "role_manager", inherits: "sales" },
    ]

    it("walks a three deep custom chain despite mixed spellings", () => {
      expect(isRoleAtLeastAsRestrictive("role_manager", "staff", mixed)).toBe(
        true
      )
      expect(
        isRoleAtLeastAsRestrictive("role_sales", "role_staff", mixed)
      ).toBe(true)
    })

    it("still refuses roles that genuinely do not reach the parent", () => {
      expect(isRoleAtLeastAsRestrictive("role_staff", "sales", mixed)).toBe(
        false
      )
    })

    it("offers the whole descendant chain in the allowed list", () => {
      expect(getRolesAtLeastAsRestrictive("staff", mixed).sort()).toEqual(
        ["role_staff", "role_sales", "role_manager"].sort()
      )
    })
  })

  describe("isRoleAtLeastAsRestrictive", () => {
    it("always allows ADMIN, regardless of branch", () => {
      expect(isRoleAtLeastAsRestrictive("ADMIN", "role_sales", roles)).toBe(
        true
      )
    })

    it("allows the same role and descendants, refuses ancestors and other branches", () => {
      expect(
        isRoleAtLeastAsRestrictive("role_sales", "role_sales", roles)
      ).toBe(true)
      expect(
        isRoleAtLeastAsRestrictive("role_manager", "role_sales", roles)
      ).toBe(true)
      expect(isRoleAtLeastAsRestrictive("BASIC", "role_sales", roles)).toBe(
        false
      )
      expect(isRoleAtLeastAsRestrictive("POWER", "role_sales", roles)).toBe(
        false
      )
    })
  })

  describe("getRolesAtLeastAsRestrictive", () => {
    it("excludes ancestors (Basic/Public) and unrelated branches (Power) under a custom parent", () => {
      expect(restrictive("role_sales")).toEqual(
        ["ADMIN", "role_manager", "role_sales"].sort()
      )
    })

    it("includes descendants and Admin under a built-in parent, excluding lower roles", () => {
      expect(restrictive("BASIC")).toEqual(
        ["ADMIN", "POWER", "BASIC", "role_sales", "role_manager"].sort()
      )
    })

    it("allows every role under a PUBLIC parent", () => {
      expect(restrictive("PUBLIC")).toEqual(roles.map(r => r._id).sort())
    })

    it("allows only Admin under an Admin parent", () => {
      expect(restrictive("ADMIN")).toEqual(["ADMIN"])
    })
  })
})
