import {
  RoleHierarchy,
  PermissionLevel,
  PermissionType,
  levelToNumber,
  getAllowedLevels,
  BuiltinPermissionID,
  getBuiltinPermissions,
  getBuiltinPermissionByID,
  doesHaveBasePermission,
  isPermissionLevelHigherThanRead,
  BUILDER,
} from "../permissions"

jest.mock("../permissions", () => ({
  // getTenantId: jest.fn(() => "budibase"),
  // DEFAULT_TENANT_ID: "default",
}))
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
  const rolesHierarchy: RoleHierarchy = [
    { permissionId: BuiltinPermissionID.READ_ONLY },
  ]

  it("should return true for read permission of read only role", () => {
    expect(
      doesHaveBasePermission(
        PermissionType.TABLE,
        PermissionLevel.READ,
        rolesHierarchy
      )
    ).toBe(true)
  })

  it("should return false for write permission of read only role", () => {
    expect(
      doesHaveBasePermission(
        PermissionType.TABLE,
        PermissionLevel.WRITE,
        rolesHierarchy
      )
    ).toBe(false)
  })

  it("should return true for execute permission of public role", () => {
    expect(
      doesHaveBasePermission(
        PermissionType.WEBHOOK,
        PermissionLevel.EXECUTE,
        rolesHierarchy
      )
    ).toBe(true)
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
