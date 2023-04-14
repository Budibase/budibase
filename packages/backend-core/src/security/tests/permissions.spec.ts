import { cloneDeep } from "lodash"
import {
  doesHaveBasePermission,
  getBuiltinPermissionByID,
  isPermissionLevelHigherThanRead,
  PermissionLevel,
  PermissionType,
  levelToNumber,
  getAllowedLevels,
  BuiltinPermissionID,
  getBuiltinPermissions,
  BUILTIN_PERMISSIONS,
  Permission,
} from "../permissions"
import { BUILTIN_ROLE_IDS } from "../roles"

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
describe("getAllowedLevels", () => {
  it('should return ["execute"] for EXECUTE', () => {
    expect(getAllowedLevels(PermissionLevel.EXECUTE)).toEqual([
      PermissionLevel.EXECUTE,
    ])
  })

  it('should return ["execute", "read"] for READ', () => {
    expect(getAllowedLevels(PermissionLevel.READ)).toEqual([
      PermissionLevel.EXECUTE,
      PermissionLevel.READ,
    ])
  })

  it('should return ["execute", "read", "write"] for WRITE', () => {
    expect(getAllowedLevels(PermissionLevel.WRITE)).toEqual([
      PermissionLevel.EXECUTE,
      PermissionLevel.READ,
      PermissionLevel.WRITE,
    ])
  })

  it('should return ["execute", "read", "write"] for ADMIN', () => {
    expect(getAllowedLevels(PermissionLevel.ADMIN)).toEqual([
      PermissionLevel.EXECUTE,
      PermissionLevel.READ,
      PermissionLevel.WRITE,
    ])
  })

  it("should return [] for an unknown permission level", () => {
    expect(getAllowedLevels("unknown" as PermissionLevel)).toEqual([])
  })
})

describe("doesHaveBasePermission", () => {
  it("should return true if base permission has the required level", () => {
    const permType = PermissionType.USER
    const permLevel = PermissionLevel.READ
    const rolesHierarchy = [
      {
        roleId: BUILTIN_ROLE_IDS.ADMIN,
        permissionId: BuiltinPermissionID.ADMIN,
      },
    ]
    expect(doesHaveBasePermission(permType, permLevel, rolesHierarchy)).toBe(
      true
    )
  })

  it("should return false if base permission does not have the required level", () => {
    const permType = PermissionType.APP
    const permLevel = PermissionLevel.READ
    const rolesHierarchy = [
      {
        roleId: BUILTIN_ROLE_IDS.PUBLIC,
        permissionId: BuiltinPermissionID.PUBLIC,
      },
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

describe("getBuiltinPermissions", () => {
  test("returns a clone of the builtin permissions", () => {
    const builtins = getBuiltinPermissions()
    expect(builtins).toEqual(cloneDeep(BUILTIN_PERMISSIONS))
    expect(builtins).not.toBe(BUILTIN_PERMISSIONS)
  })
})

describe("getBuiltinPermissionByID", () => {
  test("returns correct permission object for valid ID", () => {
    const expectedPermission = {
      _id: BuiltinPermissionID.PUBLIC,
      name: "Public",
      permissions: [
        new Permission(PermissionType.WEBHOOK, PermissionLevel.EXECUTE),
      ],
    }
    expect(getBuiltinPermissionByID("public")).toEqual(expectedPermission)
  })
})
