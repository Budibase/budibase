import {
  allGlobalUsers,
  readGlobalUser,
  saveGlobalUser,
  deleteGlobalUser,
} from "../../../utilities/workerRequests"
import { search as stringSearch } from "./utils"

function fixUser(ctx: any) {
  if (!ctx.request.body) {
    return ctx
  }
  if (!ctx.request.body._id && ctx.params.userId) {
    ctx.request.body._id = ctx.params.userId
  }
  if (!ctx.request.body.roles) {
    ctx.request.body.roles = {}
  }
  return ctx
}

function getUser(ctx: any, userId?: string) {
  if (userId) {
    ctx.params = { userId }
  } else if (!ctx.params?.userId) {
    throw "No user ID provided for getting"
  }
  return readGlobalUser(ctx)
}

export async function search(ctx: any) {
  try {
    const { name } = ctx.request.body
    const users = await allGlobalUsers(ctx)
    ctx.body = {
      users: stringSearch(users, name, "email"),
    }
  } catch (err) {
    console.log(err)
  }
}

export async function create(ctx: any) {
  const response = await saveGlobalUser(fixUser(ctx))
  ctx.body = {
    user: await getUser(ctx, response._id),
  }
}

export async function read(ctx: any) {
  const response = await readGlobalUser(ctx)
  ctx.body = {
    user: response,
  }
}

export async function update(ctx: any) {
  const user = await readGlobalUser(ctx)
  ctx.request.body = {
    ...ctx.request.body,
    _rev: user._rev,
  }
  const response = await saveGlobalUser(fixUser(ctx))
  ctx.body = {
    user: await getUser(ctx, response._id),
  }
}

export async function destroy(ctx: any) {
  const user = await getUser(ctx)
  await deleteGlobalUser(ctx)
  ctx.body = {
    user,
  }
}

export default {
  create,
  read,
  update,
  destroy,
  search,
}
