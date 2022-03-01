import {
  allGlobalUsers,
  deleteGlobalUser,
  readGlobalUser,
  saveGlobalUser,
} from "../../../utilities/workerRequests"
import { search as stringSearch, wrapResponse } from "./utils"

const { getProdAppID } = require("@budibase/backend-core/db")

function fixUser(ctx: any) {
  if (!ctx.request.body) {
    return ctx
  }
  if (!ctx.request.body._id && ctx.params.userId) {
    ctx.request.body._id = ctx.params.userId
  }
  if (!ctx.request.body.roles) {
    ctx.request.body.roles = {}
  } else {
    const newRoles: { [key: string]: string } = {}
    for (let [appId, role] of Object.entries(ctx.request.body.roles)) {
      // @ts-ignore
      newRoles[getProdAppID(appId)] = role
    }
    ctx.request.body.roles = newRoles
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
  const { name } = ctx.request.body
  const users = await allGlobalUsers(ctx)
  ctx.body = stringSearch(users, name, "email")
  wrapResponse(ctx)
}

export async function create(ctx: any) {
  const response = await saveGlobalUser(fixUser(ctx))
  ctx.body = await getUser(ctx, response._id)
  wrapResponse(ctx)
}

export async function read(ctx: any) {
  ctx.body = await readGlobalUser(ctx)
  wrapResponse(ctx)
}

export async function update(ctx: any) {
  const user = await readGlobalUser(ctx)
  ctx.request.body = {
    ...ctx.request.body,
    _rev: user._rev,
  }
  const response = await saveGlobalUser(fixUser(ctx))
  ctx.body = await getUser(ctx, response._id)
  wrapResponse(ctx)
}

export async function destroy(ctx: any) {
  const user = await getUser(ctx)
  await deleteGlobalUser(ctx)
  ctx.body = user
  wrapResponse(ctx)
}

export default {
  create,
  read,
  update,
  destroy,
  search,
}
