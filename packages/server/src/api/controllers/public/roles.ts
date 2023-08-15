import {
  UserCtx,
  RoleAssignmentResponse,
  RoleAssignmentRequest,
} from "@budibase/types"
import { Next } from "koa"
import { sdk } from "@budibase/pro"

async function assign(
  ctx: UserCtx<RoleAssignmentRequest, RoleAssignmentResponse>,
  next: Next
) {
  const { userIds, ...assignmentProps } = ctx.request.body
  await sdk.publicApi.roles.assign(userIds, assignmentProps)
  ctx.body = { userIds }
  await next()
}

async function unAssign(
  ctx: UserCtx<RoleAssignmentRequest, RoleAssignmentResponse>,
  next: Next
) {
  const { userIds, ...unAssignmentProps } = ctx.request.body
  await sdk.publicApi.roles.unAssign(userIds, unAssignmentProps)
  ctx.body = { userIds }
  await next()
}

export default {
  assign,
  unAssign,
}
