import cloneDeep from "lodash/cloneDeep"
import * as permissions from "../permissions"
import { BUILTIN_ROLE_IDS } from "../roles"

describe("levelToNumber", () => {
  it("should return 0 for EXECUTE", () => {
    expect(permissions.levelToNumber(permissions.PermissionLevel.EXECUTE)).toBe(
      0
    )
  })

  it("should return 1 for READ", () => {
    expect(permissions.levelToNumber(permissions.PermissionLevel.READ)).toBe(1)
  })

  it("should return 2 for WRITE", () => {
    expect(permissions.levelToNumber(permissions.PermissionLevel.WRITE)).toBe(2)
  })

  it("should return 3 for ADMIN", () => {
    expect(permissions.levelToNumber(permissions.PermissionLevel.ADMIN)).toBe(3)
  })

  it("should return -1 for an unknown permission level", () => {
    expect(
      permissions.levelToNumber("unknown" as permissions.PermissionLevel)
    ).toBe(-1)
  })
})
describe("getAllowedLevels", () => {
  it('should return ["execute"] for EXECUTE', () => {
    expect(
      permissions.getAllowedLevels(permissions.PermissionLevel.EXECUTE)
    ).toEqual([permissions.PermissionLevel.EXECUTE])
  })

  it('should return ["execute", "read"] for READ', () => {
    expect(
      permissions.getAllowedLevels(permissions.PermissionLevel.READ)
    ).toEqual([
      permissions.PermissionLevel.EXECUTE,
      permissions.PermissionLevel.READ,
    ])
  })

  it('should return ["execute", "read", "write"] for WRITE', () => {
    expect(
      permissions.getAllowedLevels(permissions.PermissionLevel.WRITE)
    ).toEqual([
      permissions.PermissionLevel.EXECUTE,
      permissions.PermissionLevel.READ,
      permissions.PermissionLevel.WRITE,
    ])
  })

  it('should return ["execute", "read", "write"] for ADMIN', () => {
    expect(
      permissions.getAllowedLevels(permissions.PermissionLevel.ADMIN)
    ).toEqual([
      permissions.PermissionLevel.EXECUTE,
      permissions.PermissionLevel.READ,
      permissions.PermissionLevel.WRITE,
    ])
  })

  it("should return [] for an unknown permission level", () => {
    expect(
      permissions.getAllowedLevels("unknown" as permissions.PermissionLevel)
    ).toEqual([])
  })
})

describe("doesHaveBasePermission", () => {
  it("should return true if base permission has the required level", () => {
    const permType = permissions.PermissionType.USER
    const permLevel = permissions.PermissionLevel.READ
    const rolesHierarchy = [
      {
        roleId: BUILTIN_ROLE_IDS.ADMIN,
        permissionId: permissions.BuiltinPermissionID.ADMIN,
      },
    ]
    expect(
      permissions.doesHaveBasePermission(permType, permLevel, rolesHierarchy)
    ).toBe(true)
  })

  it("should return false if base permission does not have the required level", () => {
    const permType = permissions.PermissionType.APP
    const permLevel = permissions.PermissionLevel.READ
    const rolesHierarchy = [
      {
        roleId: BUILTIN_ROLE_IDS.PUBLIC,
        permissionId: permissions.BuiltinPermissionID.PUBLIC,
      },
    ]
    expect(
      permissions.doesHaveBasePermission(permType, permLevel, rolesHierarchy)
    ).toBe(false)
  })
})

describe("isPermissionLevelHigherThanRead", () => {
  it("should return true if level is higher than read", () => {
    expect(
      permissions.isPermissionLevelHigherThanRead(
        permissions.PermissionLevel.WRITE
      )
    ).toBe(true)
  })

  it("should return false if level is read or lower", () => {
    expect(
      permissions.isPermissionLevelHigherThanRead(
        permissions.PermissionLevel.READ
      )
    ).toBe(false)
  })
})

describe("getBuiltinPermissions", () => {
  it("returns a clone of the builtin permissions", () => {
    const builtins = permissions.getBuiltinPermissions()
    expect(builtins).toEqual(cloneDeep(permissions.BUILTIN_PERMISSIONS))
    expect(builtins).not.toBe(permissions.BUILTIN_PERMISSIONS)
  })
})

describe("getBuiltinPermissionByID", () => {
  it("returns correct permission object for valid ID", () => {
    const expectedPermission = {
      _id: permissions.BuiltinPermissionID.PUBLIC,
      name: "Public",
      permissions: [
        new permissions.Permission(
          permissions.PermissionType.WEBHOOK,
          permissions.PermissionLevel.EXECUTE
        ),
      ],
    }
    expect(permissions.getBuiltinPermissionByID("public")).toEqual(
      expectedPermission
    )
  })
})
