import { InternalTables } from "../db/utils"
import { getGlobalUser } from "./global"
import { context, roles } from "@budibase/backend-core"
import { UserCtx } from "@budibase/types"

export async function getFullUser(ctx: UserCtx, userId: string) {
  const global = await getGlobalUser(userId)
  let metadata: any = {}

  // always prefer the user metadata _id and _rev
  delete global._id
  delete global._rev

  try {
    // this will throw an error if the db doesn't exist, or there is no appId
    const db = context.getAppDB()
    metadata = await db.get(userId)
  } catch (err) {
    // it is fine if there is no user metadata yet
  }
  delete metadata.csrfToken
  return {
    ...metadata,
    ...global,
    roleId: global.roleId || roles.BUILTIN_ROLE_IDS.PUBLIC,
    tableId: InternalTables.USER_METADATA,
    // make sure the ID is always a local ID, not a global one
    _id: userId,
  }
}

export function publicApiUserFix(ctx: UserCtx) {
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
