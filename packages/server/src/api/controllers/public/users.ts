import {
  allGlobalUsers,
  deleteGlobalUser,
  readGlobalUser,
  saveGlobalUser,
} from "../../../utilities/workerRequests"
import { publicApiUserFix } from "../../../utilities/users"
import { db as dbCore } from "@budibase/backend-core"
import { search as stringSearch } from "./utils"
import { UserCtx, User } from "@budibase/types"
import { Next } from "koa"
import { sdk } from "@budibase/pro"
import { isEqual, cloneDeep } from "lodash"

function rolesRemoved(base: User, ctx: UserCtx) {
  return (
    !isEqual(base.builder, ctx.request.body.builder) ||
    !isEqual(base.admin, ctx.request.body.admin) ||
    !isEqual(base.roles, ctx.request.body.roles)
  )
}

const NO_ROLES_MSG =
  "Roles/admin/builder can only be set on business/enterprise licenses - input ignored."

async function createUpdateResponse(ctx: UserCtx, user?: User) {
  const base = cloneDeep(ctx.request.body)
  ctx = await sdk.publicApi.users.roleCheck(ctx, user)
  // check the ctx before any updates to it
  const removed = rolesRemoved(base, ctx)
  ctx = publicApiUserFix(ctx)
  const response = await saveGlobalUser(ctx)
  ctx.body = await getUser(ctx, response._id)
  if (removed) {
    ctx.extra = { message: NO_ROLES_MSG }
  }
  return ctx
}

function isLoggedInUser(ctx: UserCtx, user: User) {
  const loggedInId = ctx.user?._id
  const globalUserId = dbCore.getGlobalIDFromUserMetadataID(loggedInId!)
  // check both just incase
  return globalUserId === user._id || loggedInId === user._id
}

function getUser(ctx: UserCtx, userId?: string) {
  if (userId) {
    ctx.params = { userId }
  } else if (!ctx.params?.userId) {
    throw "No user ID provided for getting"
  }
  return readGlobalUser(ctx)
}

export async function search(ctx: UserCtx, next: Next) {
  const { name } = ctx.request.body
  const users = await allGlobalUsers(ctx)
  ctx.body = stringSearch(users, name, "email")
  await next()
}

export async function create(ctx: UserCtx, next: Next) {
  await createUpdateResponse(ctx)
  await next()
}

export async function read(ctx: UserCtx, next: Next) {
  ctx.body = await readGlobalUser(ctx)
  await next()
}

export async function update(ctx: UserCtx, next: Next) {
  const user = await readGlobalUser(ctx)
  ctx.request.body = {
    ...ctx.request.body,
    _rev: user._rev,
  }
  await createUpdateResponse(ctx, user)
  await next()
}

export async function destroy(ctx: UserCtx, next: Next) {
  const user = await getUser(ctx)
  // disallow deleting yourself
  if (isLoggedInUser(ctx, user)) {
    ctx.throw(405, "Cannot delete user using its own API key.")
  }
  await deleteGlobalUser(ctx)
  ctx.body = user
  await next()
}

export default {
  create,
  read,
  update,
  destroy,
  search,
}
