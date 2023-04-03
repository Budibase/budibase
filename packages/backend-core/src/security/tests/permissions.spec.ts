import {
  getBuiltinPermissions,
  getBuiltinPermissionByID,
  doesHaveBasePermission,
  isPermissionLevelHigherThanRead,
} from "./permissions"

describe("getBuiltinPermissions", () => {
  it("should return a deep clone of BUILTIN_PERMISSIONS", () => {
    const permissions = getBuiltinPermissions()
    expect(permissions).toEqual(BUILTIN_PERMISSIONS)
    expect(permissions).not.toBe(BUILTIN_PERMISSIONS)
  })
})

describe("getBuiltinPermissionByID", () => {
  it("should return the correct permission object", () => {
    const id = "123"
    const permission = { _id: id, name: "Test Permission" }
    const permissions = { "0": permission }
    expect(getBuiltinPermissionByID(id)).toEqual(permission)
    expect(getBuiltinPermissionByID("456")).toBeUndefined()
  })
})

describe("doesHaveBasePermission", () => {
  it("should return true if base permission has the required level", () => {
    const permType = "someType"
    const permLevel = "write"
    const rolesHierarchy = [
      { roleId: "role1", permissionId: "permission1" },
      { roleId: "role2", permissionId: "permission2" },
    ]
    const permissions = [{ type: permType, level: permLevel }]
    const builtinPermissions = {
      permission1: { _id: "permission1", permissions: permissions },
      permission2: { _id: "permission2", permissions: [] },
      permission3: { _id: "permission3", permissions: [] },
    }
    expect(
      doesHaveBasePermission(
        permType,
        permLevel,
        rolesHierarchy,
        builtinPermissions
      )
    ).toBeTruthy()
  })

  it("should return false if base permission does not have the required level", () => {
    const permType = "someType"
    const permLevel = "write"
    const rolesHierarchy = [
      { roleId: "role1", permissionId: "permission1" },
      { roleId: "role2", permissionId: "permission2" },
    ]
    const permissions = [{ type: permType, level: "read" }]
    const builtinPermissions = {
      permission1: { _id: "permission1", permissions: permissions },
      permission2: { _id: "permission2", permissions: [] },
      permission3: { _id: "permission3", permissions: [] },
    }
    expect(
      doesHaveBasePermission(
        permType,
        permLevel,
        rolesHierarchy,
        builtinPermissions
      )
    ).toBeFalsy()
  })
})

describe("isPermissionLevelHigherThanRead", () => {
  it("should return true if level is higher than read", () => {
    expect(isPermissionLevelHigherThanRead("write")).toBeTruthy()
    expect(isPermissionLevelHigherThanRead("admin")).toBeTruthy()
  })

  it("should return false if level is read or lower", () => {
    expect(isPermissionLevelHigherThanRead("read")).toBeFalsy()
    expect(isPermissionLevelHigherThanRead("none")).toBeFalsy()
  })
})
