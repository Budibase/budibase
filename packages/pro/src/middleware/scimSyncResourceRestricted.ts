import { Ctx, User, UserGroup } from "@budibase/types"
import { users } from "@budibase/backend-core"
import { groups } from "../db"

export const scimUserOnly = (paramId: string) =>
  scimSyncChecks(users.getById, paramId, true)

export const scimGroupOnly = (paramId: string) =>
  scimSyncChecks(groups.get, paramId, true)

export const internalGroupOnly = (paramId: string) =>
  scimSyncChecks(groups.get, paramId, false)

function scimSyncChecks(
  getter: (id: string) => Promise<User | UserGroup>,
  paramId: string,
  scimRequired: boolean
) {
  return async (ctx: Ctx, next: any) => {
    const id = ctx.params[paramId]

    if (typeof id !== "string") {
      ctx.throw(404)
    }

    const existingResource = await getter(id)
    if (!!existingResource.scimInfo?.isSync !== scimRequired) {
      ctx.throw(404)
    }

    return next()
  }
}
