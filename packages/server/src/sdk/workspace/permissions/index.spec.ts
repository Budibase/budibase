import { roles } from "@budibase/backend-core"
import { PermissionLevel, PermissionType } from "@budibase/types"
import { canRoleAccessResource } from "."

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    roles: {
      ...actual.roles,
      getAllRoles: jest.fn(),
      getUserRoleHierarchy: jest.fn(),
    },
  }
})

describe("canRoleAccessResource", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  const roleWithExecutePermission = ({
    roleId,
    resourceId,
  }: {
    roleId: string
    resourceId: string
  }) => ({
    ...roles.getBuiltinRoles()[roleId],
    permissions: {
      [resourceId]: [PermissionLevel.EXECUTE],
    },
  })

  it("denies base access when a resource role is set", async () => {
    const resourceId = "au_test"
    const adminRole = roleWithExecutePermission({
      roleId: roles.BUILTIN_ROLE_IDS.ADMIN,
      resourceId,
    })
    const basicRole = roles.getBuiltinRoles()[roles.BUILTIN_ROLE_IDS.BASIC]

    jest.mocked(roles.getAllRoles).mockResolvedValue([adminRole])
    jest.mocked(roles.getUserRoleHierarchy).mockResolvedValue([basicRole])

    await expect(
      canRoleAccessResource({
        roleId: roles.BUILTIN_ROLE_IDS.BASIC,
        resourceId,
        permissionType: PermissionType.AUTOMATION,
        permissionLevel: PermissionLevel.EXECUTE,
      })
    ).resolves.toBe(false)
  })

  it("allows access when the role hierarchy includes the resource role", async () => {
    const resourceId = "au_test"
    const adminRole = roleWithExecutePermission({
      roleId: roles.BUILTIN_ROLE_IDS.ADMIN,
      resourceId,
    })

    jest.mocked(roles.getAllRoles).mockResolvedValue([adminRole])
    jest.mocked(roles.getUserRoleHierarchy).mockResolvedValue([adminRole])

    await expect(
      canRoleAccessResource({
        roleId: roles.BUILTIN_ROLE_IDS.ADMIN,
        resourceId,
        permissionType: PermissionType.AUTOMATION,
        permissionLevel: PermissionLevel.EXECUTE,
      })
    ).resolves.toBe(true)
  })

  it("allows access when the resource is public", async () => {
    const resourceId = "au_test"
    const publicRole = roleWithExecutePermission({
      roleId: roles.BUILTIN_ROLE_IDS.PUBLIC,
      resourceId,
    })

    jest.mocked(roles.getAllRoles).mockResolvedValue([publicRole])
    jest.mocked(roles.getUserRoleHierarchy).mockResolvedValue([])

    await expect(
      canRoleAccessResource({
        roleId: roles.BUILTIN_ROLE_IDS.PUBLIC,
        resourceId,
        permissionType: PermissionType.AUTOMATION,
        permissionLevel: PermissionLevel.EXECUTE,
      })
    ).resolves.toBe(true)
  })
})
