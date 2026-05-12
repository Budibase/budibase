import { users } from "@budibase/backend-core"
import { UserCtx } from "@budibase/types"
import { Next } from "koa"
import { sdk } from "@budibase/pro"
import {
  RoleAssignmentResponse,
  RoleUnAssignRequest,
  RoleAssignRequest,
} from "./mapping/types"
import { syncUsersAgainstWorkspaces } from "../../../sdk/workspace/workspaces/sync"

type GlobalRoleUpdate = {
  builder?: boolean
  admin?: boolean
}

const validateGlobalRoleUpdate = (
  ctx: UserCtx,
  roleUpdate: GlobalRoleUpdate
) => {
  if (roleUpdate.admin && !users.isAdmin(ctx.user)) {
    ctx.throw(403, "Only global admins can update global admin permissions.")
  }

  if (roleUpdate.builder && !users.isGlobalBuilder(ctx.user)) {
    ctx.throw(
      403,
      "Only global builders or admins can update global builder permissions."
    )
  }
}

async function assign(
  ctx: UserCtx<RoleAssignRequest, RoleAssignmentResponse>,
  next: Next
) {
  const { userIds, ...assignmentProps } = ctx.request.body
  validateGlobalRoleUpdate(ctx, assignmentProps)
  await sdk.publicApi.roles.assign(userIds, assignmentProps)
  const workspaceIds = [
    assignmentProps.role?.appId,
    assignmentProps.appBuilder?.appId,
  ].filter((id): id is string => !!id)
  await syncUsersAgainstWorkspaces(userIds, workspaceIds)
  ctx.body = { data: { userIds } }
  await next()
}

async function unAssign(
  ctx: UserCtx<RoleUnAssignRequest, RoleAssignmentResponse>,
  next: Next
) {
  const { userIds, ...unAssignmentProps } = ctx.request.body
  validateGlobalRoleUpdate(ctx, unAssignmentProps)
  await sdk.publicApi.roles.unAssign(userIds, unAssignmentProps)
  const workspaceIds = [
    unAssignmentProps.role?.appId,
    unAssignmentProps.appBuilder?.appId,
  ].filter((id): id is string => !!id)
  await syncUsersAgainstWorkspaces(userIds, workspaceIds)
  ctx.body = { data: { userIds } }
  await next()
}

export default {
  assign,
  unAssign,
}
