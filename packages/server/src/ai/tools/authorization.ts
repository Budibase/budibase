import { context, permissions, roles, users } from "@budibase/backend-core"
import {
  ToolExecutionPrincipal,
  type AgentExecutionContext,
} from "@budibase/types"
import sdk from "../../sdk"
import { getFullUser } from "../../utilities/users"
import type { ToolAuthorization, ToolAuthorizationRuntime } from "."

const DENIED_MESSAGE = "Tool is not available in this security context"

export const filterAgentToolCollectionResult = async ({
  result,
  collectionKey,
  permissionType,
  permissionLevel,
  resolveResourceId,
  runtime,
}: {
  result: unknown
  collectionKey: string
  permissionType: ToolAuthorization["permissionType"]
  permissionLevel: ToolAuthorization["permissionLevel"]
  resolveResourceId: (item: unknown) => string | undefined
  runtime: ToolAuthorizationRuntime
}) => {
  if (!result || typeof result !== "object" || !(collectionKey in result)) {
    return result
  }
  const collection = Reflect.get(result, collectionKey)
  if (!Array.isArray(collection)) {
    return result
  }

  const allowedItems = await Promise.all(
    collection.map(async item => {
      const resourceId = resolveResourceId(item)
      if (!resourceId) {
        return false
      }
      try {
        await runtime.authorize({
          authorization: { permissionType, permissionLevel, resourceId },
          input: undefined,
          executionContext: runtime.executionContext,
          principal: runtime.principal,
        })
        return true
      } catch {
        return false
      }
    })
  )

  return {
    ...result,
    [collectionKey]: collection.filter((_item, index) => allowedItems[index]),
  }
}

export const authorizeAgentToolCall = async ({
  authorization,
  input,
  executionContext,
  principal,
}: {
  authorization: ToolAuthorization
  input: unknown
  executionContext: AgentExecutionContext
  principal: ToolExecutionPrincipal
}) => {
  const audit = (decision: "allowed" | "denied", resourceId?: string) =>
    console.log("Agent tool authorization", {
      decision,
      requesterId: executionContext.requestingUserId,
      effectivePrincipal: principal,
      agentId: executionContext.agentId,
      operationId: executionContext.operationId,
      conversationId: executionContext.conversationId,
      workspaceId: executionContext.workspaceId,
      resourceId,
      permissionType: authorization.permissionType,
      permissionLevel: authorization.permissionLevel,
    })

  const resourceId =
    authorization.resourceId || authorization.resolveResourceId?.(input)
  try {
    if (
      context.getTenantId() !== executionContext.tenantId ||
      context.getWorkspaceId() !== executionContext.workspaceId
    ) {
      throw new Error(DENIED_MESSAGE)
    }

    // Always rehydrate the requester, including admin-authority calls. This
    // makes removal of the initiating user revoke delayed work.
    const requestingUser = await getFullUser(executionContext.requestingUserId)
    if (principal === ToolExecutionPrincipal.ADMIN) {
      audit("allowed", resourceId)
      return
    }
    if (
      !executionContext.requestingUserRoleId &&
      users.isBuilder(requestingUser, executionContext.workspaceId)
    ) {
      audit("allowed", resourceId)
      return
    }

    const userRoles = await roles.getUserRoleHierarchy(
      executionContext.requestingUserRoleId ||
        requestingUser.roleId ||
        roles.BUILTIN_ROLE_IDS.PUBLIC
    )
    if (resourceId) {
      const resourcePermissions =
        await sdk.permissions.getResourcePerms(resourceId)
      const allowedRole =
        resourcePermissions[authorization.permissionLevel]?.role
      if (allowedRole) {
        if (userRoles.some(role => role._id === allowedRole)) {
          audit("allowed", resourceId)
          return
        }
        throw new Error(DENIED_MESSAGE)
      }
    }

    if (
      !permissions.doesHaveBasePermission(
        authorization.permissionType,
        authorization.permissionLevel,
        userRoles
      )
    ) {
      throw new Error(DENIED_MESSAGE)
    }
    audit("allowed", resourceId)
  } catch {
    audit("denied", resourceId)
    throw new Error(DENIED_MESSAGE)
  }
}
