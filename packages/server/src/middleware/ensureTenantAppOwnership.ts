import { tenancy, utils } from "@budibase/backend-core"
import { UserCtx } from "@budibase/types"

async function ensureTenantAppOwnership(ctx: UserCtx, next: any) {
  const appId = await utils.getAppIdFromCtx(ctx)
  if (!appId) {
    ctx.throw(400, "appId must be provided")
  }
  const tenantId = tenancy.getTenantId()
  if (appId !== tenantId) {
    ctx.throw(403, `App does not belong to tenant`)
  }
  await next()
}

export default ensureTenantAppOwnership
