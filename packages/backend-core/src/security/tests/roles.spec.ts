import { PermissionLevel } from "../permissions"
import * as roles from "../roles"
describe("Role", () => {
  describe("constructor", () => {
    it("it should initialize _id, name, and permissionId", () => {
      const role = new roles.Role("new-role", "New Role", PermissionLevel.READ)
      expect(role._id).toEqual("new-role")
      expect(role.name).toEqual("New Role")
      expect(role.permissionId).toEqual(PermissionLevel.READ)
    })
  })

  describe("addInheritance", () => {
    it("it should add the inheritance property to the role", () => {
      const role = new roles.Role("new-role", "New Role", PermissionLevel.READ)
      const newRole = role.addInheritance("other-role")
      expect(newRole).toEqual(role)
      expect(role.inherits).toEqual("other-role")
    })
  })

  describe("getBuiltinRoles", () => {
    it("it should return an object of builtin roles", () => {
      const builtinRoles = roles.getBuiltinRoles()
      expect(builtinRoles).toHaveProperty("ADMIN")
      expect(builtinRoles).toHaveProperty("POWER")
      expect(builtinRoles).toHaveProperty("BASIC")
      expect(builtinRoles).toHaveProperty("PUBLIC")
    })
  })

  describe("isBuiltin", () => {
    it("returns true for built-in role", () => {
      const result = roles.isBuiltin("ADMIN")
      expect(result).toBe(true)
    })

    it("returns false for non-built-in role", () => {
      const result = roles.isBuiltin("DEVELOPER")
      expect(result).toBe(false)
    })

    it("returns false when role is undefined", () => {
      const result = roles.isBuiltin()
      expect(result).toBe(false)
    })

    it("returns true when role includes built-in role partially", () => {
      const result = roles.isBuiltin("SUPERADMIN")
      expect(result).toBe(true)
    })
  })

  describe("builtinRoleToNumber", () => {
    it("returns 0 when id is undefined", () => {
      const result = roles.builtinRoleToNumber()
      expect(result).toBe(0)
    })

    it("returns MAX + 1 when id is admin or builder", () => {
      const result = roles.builtinRoleToNumber("ADMIN")
      expect(result).toBe(Object.values(roles.getBuiltinRoles()).length + 1)

      const result2 = roles.builtinRoleToNumber("BUILDER")
      expect(result2).toBe(Object.values(roles.getBuiltinRoles()).length + 1)
    })

    it("returns correct number when id is a built-in role", () => {
      const result = roles.builtinRoleToNumber("BASIC")
      expect(result).toBe(2)

      const result2 = roles.builtinRoleToNumber("POWER")
      expect(result2).toBe(3)
    })

    it("returns 0 when id is not a built-in role", () => {
      const result = roles.builtinRoleToNumber("DEVELOPER")
      expect(result).toBe(0)
    })
  })

  describe("roleToNumber", () => {
    it("returns 0 when id is undefined", async () => {
      const result = await roles.roleToNumber()
      expect(result).toBe(0)
    })

    it("returns correct number when id is a built-in role", async () => {
      const result = await roles.roleToNumber("BASIC")
      expect(result).toBe(2)

      const result2 = await roles.roleToNumber("ADMIN")
      expect(result2).toBeGreaterThan(
        Object.values(roles.getBuiltinRoles()).length
      )
    })

    it("returns correct number when id inherits a built-in role", async () => {
      const result = await roles.roleToNumber("POWER")
      expect(result).toBe(3)
    })
  })
  describe("lowerBuiltinRoleID", () => {
    it("returns the first roleId if the second roleId is undefined", () => {
      const roleId1 = "ADMIN"
      const result = roles.lowerBuiltinRoleID(roleId1, undefined)
      expect(result).toBe(roleId1)
    })

    it("returns the second roleId if the first roleId is undefined", () => {
      const roleId2 = "ADMIN"
      const result = roles.lowerBuiltinRoleID(undefined, roleId2)
      expect(result).toBe(roleId2)
    })

    it("returns the roleId with lower priority", () => {
      const roleId1 = "ADMIN"
      const roleId2 = "POWER"
      const result = roles.lowerBuiltinRoleID(roleId1, roleId2)
      expect(result).toBe(roleId2)

      const roleId3 = "BASIC"
      const result2 = roles.lowerBuiltinRoleID(roleId2, roleId3)
      expect(result2).toBe(roleId3)
    })

    it("returns either roleId if they have the same priority", () => {
      const roleId1 = "PUBLIC"
      const roleId2 = "BUILDER"
      const result = roles.lowerBuiltinRoleID(roleId1, roleId2)
      expect(result).toBe(roleId1)

      const roleId3 = "BASIC"
      const roleId4 = "BASIC"
      const result2 = roles.lowerBuiltinRoleID(roleId3, roleId4)
      expect(result2).toBe(roleId3)
    })
  })

  describe("getRole", () => {
    it("returns undefined if roleId is undefined", async () => {
      const result = await roles.getRole(undefined)
      expect(result).toBeUndefined()
    })

    it("retrieves a built-in role if isBuiltin(roleId) is true", async () => {
      const roleId = "BASIC"
      const mockBuiltInRole = {
        _id: roleId,
        name: "Basic",
        inherits: "PUBLIC",
        permissionId: "write",
        permissions: {},
      }
      const result = await roles.getRole(roleId)
      expect(result).toEqual(mockBuiltInRole)
    })
  })

  describe("getUserRoleHierarchy", () => {
    it("returns empty if userRoleId is undefined", async () => {
      const result = await roles.getUserRoleHierarchy()
      expect(result).toEqual([])
    })

    it("returns all user roles if userRoleId is admin", async () => {
      const result = await roles.getUserRoleHierarchy("ADMIN")
      expect(result).toEqual(["ADMIN", "POWER", "BASIC", "PUBLIC"])
    })

    it("returns hierarchy of user roles for a valid userRoleId", async () => {
      const result = await roles.getUserRoleHierarchy("BASIC")
      expect(result).toEqual(["BASIC", "PUBLIC"])
    })

    it("returns hierarchy of user roles with role objects if opts.idOnly is false", async () => {
      const result = await roles.getUserRoleHierarchy("BASIC", {
        idOnly: false,
      })
      expect(result).toBe([
        {
          _id: "BASIC",
          name: "Basic",
          inherits: "PUBLIC",
          permissionId: "write",
          permissions: {},
        },
        {
          _id: "PUBLIC",
          name: "Public",
          permissionId: "public",
          permissions: {},
        },
      ])
    })
  })
  describe("getAllRoles", () => {
    it("should return all roles for an app if appId is provided", async () => {
      const appId = "123"
      const expectedRoles = [{ _id: "role1" }, { _id: "role2" }]
      roles.getAllRoles.mockImplementationOnce(async () => expectedRoles)
      const result = await roles.getAllRoles(appId)
      expect(result).toEqual(expectedRoles)
    })

    it("should return all built-in roles if no appId is provided", async () => {
      const expectedRoles = [{ _id: "role1" }, { _id: "role2" }]
      roles.getAllRoles.mockImplementationOnce(async () => expectedRoles)
      const result = await roles.getAllRoles()
      expect(result).toEqual(expectedRoles)
    })
  })
})
