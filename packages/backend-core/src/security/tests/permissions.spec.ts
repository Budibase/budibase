import {
  doesHaveBasePermission,
  getBuiltinPermissionByID,
  isPermissionLevelHigherThanRead,
  PermissionLevel,
  PermissionType,
} from "../permissions"

xdescribe("getBuiltinPermissionByID", () => {
  it("should return the correct permission object", () => {
    const id = "123"
    const permission = { _id: id, name: "Test Permission" }
    expect(getBuiltinPermissionByID(id)).toEqual(permission)
    expect(getBuiltinPermissionByID("456")).toBeUndefined()
  })
})

xdescribe("doesHaveBasePermission", () => {
  it("should return true if base permission has the required level", () => {
    const permType = PermissionType.APP
    const permLevel = PermissionLevel.READ
    const rolesHierarchy = [
      { roleId: "role1", permissionId: "permission1" },
      { roleId: "role2", permissionId: "permission2" },
    ]
    expect(
      doesHaveBasePermission(
        permType,
        permLevel,
        rolesHierarchy
      )
    ).toBeTruthy()
  })

  it("should return false if base permission does not have the required level", () => {
    const permType = PermissionType.APP
    const permLevel = PermissionLevel.READ
    const rolesHierarchy = [
      { roleId: "role1", permissionId: "permission1" },
      { roleId: "role2", permissionId: "permission2" },
    ]
    expect(
      doesHaveBasePermission(
        permType,
        permLevel,
        rolesHierarchy
      )
    ).toBeFalsy()
  })
})

xdescribe("isPermissionLevelHigherThanRead", () => {
  it("should return true if level is higher than read", () => {
    expect(isPermissionLevelHigherThanRead(PermissionLevel.WRITE)).toBeTruthy()
  })

  it("should return false if level is read or lower", () => {
    expect(isPermissionLevelHigherThanRead(PermissionLevel.READ)).toBeFalsy()
  })
})
