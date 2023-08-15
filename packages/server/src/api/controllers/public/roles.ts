import { UserCtx } from "@budibase/types"
import { Next } from "koa"
import { sdk } from "@budibase/pro"
import {
  RoleAssignmentResponse,
  RoleUnAssignRequest,
  RoleAssignRequest,
} from "./mapping/types"

async function assign(
  ctx: UserCtx<RoleAssignRequest, RoleAssignmentResponse>,
  next: Next
) {
  const { userIds, ...assignmentProps } = ctx.request.body
  await sdk.publicApi.roles.assign(userIds, assignmentProps)
  ctx.body = { data: { userIds } }
  await next()
}

async function unAssign(
  ctx: UserCtx<RoleUnAssignRequest, RoleAssignmentResponse>,
  next: Next
) {
  const { userIds, ...unAssignmentProps } = ctx.request.body
  await sdk.publicApi.roles.unAssign(userIds, unAssignmentProps)
  ctx.body = { data: { userIds } }
  await next()
}

export default {
  assign,
  unAssign,
}
