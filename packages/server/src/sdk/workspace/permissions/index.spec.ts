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

  it("denies base access when a resource role is set", async () => {
    const resourceId = "au_test"
    const adminRole = {
      ...roles.getBuiltinRoles()[roles.BUILTIN_ROLE_IDS.ADMIN],
      permissions: {
        [resourceId]: [PermissionLevel.EXECUTE],
      },
    }
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
})
