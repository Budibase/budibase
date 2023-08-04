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

function removeRoles(ctx: UserCtx, oldUser?: User) {
  const user = ctx.request.body
  if (user.builder) {
    user.builder = oldUser?.builder || undefined
  }
  if (user.admin) {
    user.admin = oldUser?.admin || undefined
  }
  if (user.roles) {
    user.roles = oldUser?.roles || {}
  }
  ctx.request.body = user
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
  ctx = publicApiUserFix(removeRoles(ctx))
  const response = await saveGlobalUser(ctx)
  ctx.body = await getUser(ctx, response._id)
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
  ctx = publicApiUserFix(removeRoles(ctx, user))
  const response = await saveGlobalUser(ctx)
  ctx.body = await getUser(ctx, response._id)
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
