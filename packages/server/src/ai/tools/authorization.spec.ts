import { permissions, roles } from "@budibase/backend-core"
import {
  PermissionLevel,
  PermissionType,
  ToolExecutionPrincipal,
  type Role,
} from "@budibase/types"

jest.mock("../../sdk", () => ({
  __esModule: true,
  default: {
    permissions: { getResourcePerms: jest.fn().mockResolvedValue({}) },
  },
}))

jest.mock("@budibase/backend-core", () => ({
  context: {
    getTenantId: jest.fn(() => "tenant_1"),
    getWorkspaceId: jest.fn(() => "app_1"),
  },
  permissions: { doesHaveBasePermission: jest.fn(() => true) },
  roles: {
    BUILTIN_ROLE_IDS: { PUBLIC: "PUBLIC", ADMIN: "ADMIN", BASIC: "BASIC" },
    getUserRoleHierarchy: jest.fn().mockResolvedValue([]),
  },
}))

import {
  authorizeAgentToolCall,
  canRequesterReadAgentToolResource,
} from "./authorization"

const authorization = {
  permissionType: PermissionType.TABLE,
  permissionLevel: PermissionLevel.WRITE,
  resourceId: "ta_1",
}

const executionContext = {
  tenantId: "tenant_1",
  workspaceId: "app_1",
  agentId: "agent_1",
  operationId: "operation_1",
  conversationId: "conversation_1",
  requester: {
    executorRole: "BASIC",
  },
}

describe("authorizeAgentToolCall", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(permissions.doesHaveBasePermission).mockReturnValue(true)
    jest
      .mocked(roles.getUserRoleHierarchy)
      .mockResolvedValue([{ _id: "BASIC" } as Role])
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("allows admin execution regardless of executor role", async () => {
    await expect(
      authorizeAgentToolCall({
        authorization,
        input: undefined,
        executionContext,
        principal: ToolExecutionPrincipal.ADMIN,
      })
    ).resolves.toBeUndefined()
    expect(roles.getUserRoleHierarchy).not.toHaveBeenCalled()
  })

  it("allows requester execution when the executor role has permission", async () => {
    await expect(
      authorizeAgentToolCall({
        authorization,
        input: undefined,
        executionContext,
        principal: ToolExecutionPrincipal.REQUESTER,
      })
    ).resolves.toBeUndefined()
    expect(roles.getUserRoleHierarchy).toHaveBeenCalledWith("BASIC")
  })

  it("denies requester execution when the executor role lacks permission", async () => {
    jest.mocked(permissions.doesHaveBasePermission).mockReturnValue(false)

    await expect(
      authorizeAgentToolCall({
        authorization,
        input: undefined,
        executionContext,
        principal: ToolExecutionPrincipal.REQUESTER,
      })
    ).rejects.toThrow("Tool is not available in this security context")
  })

  it("checks requester read visibility without emitting execution audit logs", async () => {
    jest.mocked(permissions.doesHaveBasePermission).mockReturnValue(false)
    const log = jest.spyOn(console, "log").mockImplementation()

    await expect(
      canRequesterReadAgentToolResource({
        resourceId: "ta_1",
        executionContext,
      })
    ).resolves.toBe(false)
    expect(log).not.toHaveBeenCalled()
  })
})
