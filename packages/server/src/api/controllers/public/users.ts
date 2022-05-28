import {
  allGlobalUsers,
  deleteGlobalUser,
  readGlobalUser,
  saveGlobalUser,
} from "../../../utilities/workerRequests"
import { publicApiUserFix } from "../../../utilities/users"
import { search as stringSearch } from "./utils"

function getUser(ctx: any, userId?: string) {
  if (userId) {
    ctx.params = { userId }
  } else if (!ctx.params?.userId) {
    throw "No user ID provided for getting"
  }
  return readGlobalUser(ctx)
}

export async function search(ctx: any, next: any) {
  const { name } = ctx.request.body
  const users = await allGlobalUsers(ctx)
  ctx.body = stringSearch(users, name, "email")
  await next()
}

export async function create(ctx: any, next: any) {
  const response = await saveGlobalUser(publicApiUserFix(ctx))
  ctx.body = await getUser(ctx, response._id)
  await next()
}

export async function read(ctx: any, next: any) {
  ctx.body = await readGlobalUser(ctx)
  await next()
}

export async function update(ctx: any, next: any) {
  const user = await readGlobalUser(ctx)
  ctx.request.body = {
    ...ctx.request.body,
    _rev: user._rev,
  }
  const response = await saveGlobalUser(publicApiUserFix(ctx))
  ctx.body = await getUser(ctx, response._id)
  await next()
}

export async function destroy(ctx: any, next: any) {
  const user = await getUser(ctx)
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
