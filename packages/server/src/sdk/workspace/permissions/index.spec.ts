import { roles } from "@budibase/backend-core"
import {
  BuiltinPermissionID,
  PermissionLevel,
  PermissionType,
} from "@budibase/types"
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

  it("allows a custom role with the required base permission", async () => {
    const roleId = "custom_role"
    const customRole = {
      ...roles.getBuiltinRoles()[roles.BUILTIN_ROLE_IDS.BASIC],
      _id: roleId,
      permissionId: BuiltinPermissionID.WRITE,
      inherits: undefined,
    }

    jest.mocked(roles.getAllRoles).mockResolvedValue([])
    jest.mocked(roles.getUserRoleHierarchy).mockResolvedValue([customRole])

    await expect(
      canRoleAccessResource({
        roleId,
        resourceId: "au_test",
        permissionType: PermissionType.AUTOMATION,
        permissionLevel: PermissionLevel.EXECUTE,
      })
    ).resolves.toBe(true)
  })
})
