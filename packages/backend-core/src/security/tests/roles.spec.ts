import { PermissionLevel } from "../permissions"
import { Role, getBuiltinRoles } from "../roles"

describe("Role", () => {
  describe("constructor", () => {
    test("it should initialize _id, name, and permissionId", () => {
      const role = new Role("my-role", "My Role", PermissionLevel.READ)
      expect(role._id).toEqual("my-role")
      expect(role.name).toEqual("My Role")
      expect(role.permissionId).toEqual(PermissionLevel.READ)
    })
  })

  describe("addInheritance", () => {
    test("it should add the inheritance property to the role", () => {
      const role = new Role("my-role", "My Role", PermissionLevel.READ)
      const newRole = role.addInheritance("other-role")
      expect(newRole).toEqual(role)
      expect(role.inherits).toEqual("other-role")
    })
  })

  describe("getBuiltinRoles", () => {
    test("it should return an object of builtin roles", () => {
      const builtinRoles = getBuiltinRoles()
      expect(builtinRoles).toHaveProperty("ADMIN")
      expect(builtinRoles).toHaveProperty("POWER")
      expect(builtinRoles).toHaveProperty("BASIC")
      expect(builtinRoles).toHaveProperty("PUBLIC")
      expect(builtinRoles).not.toHaveProperty("BUILDER")
    })
  })
})
