import { permissions } from "@budibase/backend-core"
import type { ContextUserMetadata } from "@budibase/types"
import {
  PermissionLevel,
  PermissionType,
  ToolExecutionPrincipal,
} from "@budibase/types"

const mockGetFullUser = jest.fn()

jest.mock("../../utilities/users", () => ({
  getFullUser: (...args: unknown[]) => mockGetFullUser(...args),
}))

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
    BUILTIN_ROLE_IDS: { PUBLIC: "PUBLIC" },
    getUserRoleHierarchy: jest.fn().mockResolvedValue([]),
  },
  users: { isBuilder: jest.fn(() => false) },
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
    userId: "user_1",
    authorization: { mode: "current" as const },
  },
}

describe("authorizeAgentToolCall", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("denies admin execution when a workspace member is now public", async () => {
    mockGetFullUser.mockResolvedValue({
      _id: "user_1",
      roleId: "PUBLIC",
    } as ContextUserMetadata)

    await expect(
      authorizeAgentToolCall({
        authorization,
        input: undefined,
        executionContext,
        principal: ToolExecutionPrincipal.ADMIN,
      })
    ).rejects.toThrow("Tool is not available in this security context")
  })

  it("allows admin execution while the requester remains a workspace member", async () => {
    mockGetFullUser.mockResolvedValue({
      _id: "user_1",
      roleId: "BASIC",
    } as ContextUserMetadata)

    await expect(
      authorizeAgentToolCall({
        authorization,
        input: undefined,
        executionContext,
        principal: ToolExecutionPrincipal.ADMIN,
      })
    ).resolves.toBeUndefined()
  })

  it("allows admin execution for a system requester without rehydrating a user", async () => {
    await expect(
      authorizeAgentToolCall({
        authorization,
        input: undefined,
        executionContext: {
          ...executionContext,
          requester: {
            userId: "automation:automation_1",
            authorization: { mode: "system" },
          },
        },
        principal: ToolExecutionPrincipal.ADMIN,
      })
    ).resolves.toBeUndefined()
    expect(mockGetFullUser).not.toHaveBeenCalled()
  })

  it("denies requester execution for a system requester", async () => {
    await expect(
      authorizeAgentToolCall({
        authorization,
        input: undefined,
        executionContext: {
          ...executionContext,
          requester: {
            userId: "automation:automation_1",
            authorization: { mode: "system" },
          },
        },
        principal: ToolExecutionPrincipal.REQUESTER,
      })
    ).rejects.toThrow("Tool is not available in this security context")
  })

  it("checks requester read visibility without emitting execution audit logs", async () => {
    mockGetFullUser.mockResolvedValue({
      _id: "user_1",
      roleId: "BASIC",
    } as ContextUserMetadata)
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
