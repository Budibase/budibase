import {
  doesHaveBasePermission,
  getBuiltinPermissionByID,
  isPermissionLevelHigherThanRead,
  PermissionLevel,
  PermissionType,
  levelToNumber,
} from "../permissions"

describe("levelToNumber", () => {
  it("should return 0 for EXECUTE", () => {
    expect(levelToNumber(PermissionLevel.EXECUTE)).toBe(0)
  })

  it("should return 1 for READ", () => {
    expect(levelToNumber(PermissionLevel.READ)).toBe(1)
  })

  it("should return 2 for WRITE", () => {
    expect(levelToNumber(PermissionLevel.WRITE)).toBe(2)
  })

  it("should return 3 for ADMIN", () => {
    expect(levelToNumber(PermissionLevel.ADMIN)).toBe(3)
  })

  it("should return -1 for an unknown permission level", () => {
    expect(levelToNumber("unknown" as PermissionLevel)).toBe(-1)
  })
})
describe("getBuiltinPermissionByID", () => {
  it("should return the correct permission object", () => {
    const id = "123"
    const permission = { _id: id, name: "Test Permission" }
    expect(getBuiltinPermissionByID(id)).toEqual(permission)
    expect(getBuiltinPermissionByID("456")).toBeUndefined()
  })
})

describe("doesHaveBasePermission", () => {
  it("should return true if base permission has the required level", () => {
    const permType = PermissionType.APP
    const permLevel = PermissionLevel.READ
    const rolesHierarchy = [
      { roleId: "role1", permissionId: "permission1" },
      { roleId: "role2", permissionId: "permission2" },
    ]
    expect(doesHaveBasePermission(permType, permLevel, rolesHierarchy)).toBe(
      true
    )
  })

  it("should return false if base permission does not have the required level", () => {
    const permType = PermissionType.APP
    const permLevel = PermissionLevel.READ
    const rolesHierarchy = [
      { roleId: "role1", permissionId: "permission1" },
      { roleId: "role2", permissionId: "permission2" },
    ]
    expect(doesHaveBasePermission(permType, permLevel, rolesHierarchy)).toBe(
      false
    )
  })
})

describe("isPermissionLevelHigherThanRead", () => {
  it("should return true if level is higher than read", () => {
    expect(isPermissionLevelHigherThanRead(PermissionLevel.WRITE)).toBe(true)
  })

  it("should return false if level is read or lower", () => {
    expect(isPermissionLevelHigherThanRead(PermissionLevel.READ)).toBe(false)
  })
})
