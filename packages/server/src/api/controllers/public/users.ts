import {
  allGlobalUsers,
  deleteGlobalUser,
  readGlobalUser,
  saveGlobalUser,
} from "../../../utilities/workerRequests"
import { publicApiUserFix } from "../../../utilities/users"
import { db as dbCore } from "@budibase/backend-core"
import { search as stringSearch } from "./utils"
import { BBContext, User } from "@budibase/types"

function isLoggedInUser(ctx: BBContext, user: User) {
  const loggedInId = ctx.user?._id
  const globalUserId = dbCore.getGlobalIDFromUserMetadataID(loggedInId!)
  // check both just incase
  return globalUserId === user._id || loggedInId === user._id
}

function getUser(ctx: BBContext, userId?: string) {
  if (userId) {
    ctx.params = { userId }
  } else if (!ctx.params?.userId) {
    throw "No user ID provided for getting"
  }
  return readGlobalUser(ctx)
}

export async function search(ctx: BBContext, next: any) {
  const { name } = ctx.request.body
  const users = await allGlobalUsers(ctx)
  ctx.body = stringSearch(users, name, "email")
  await next()
}

export async function create(ctx: BBContext, next: any) {
  const response = await saveGlobalUser(publicApiUserFix(ctx))
  ctx.body = await getUser(ctx, response._id)
  await next()
}

export async function read(ctx: BBContext, next: any) {
  ctx.body = await readGlobalUser(ctx)
  await next()
}

export async function update(ctx: BBContext, next: any) {
  const user = await readGlobalUser(ctx)
  ctx.request.body = {
    ...ctx.request.body,
    _rev: user._rev,
  }
  // disallow updating your own role - always overwrite with DB roles
  if (isLoggedInUser(ctx, user)) {
    ctx.request.body.builder = user.builder
    ctx.request.body.admin = user.admin
    ctx.request.body.roles = user.roles
  }
  const response = await saveGlobalUser(publicApiUserFix(ctx))
  ctx.body = await getUser(ctx, response._id)
  await next()
}

export async function destroy(ctx: BBContext, next: any) {
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
