import { tenancy, utils } from "@budibase/backend-core"
import { UserCtx } from "@budibase/types"

async function ensureTenantAppOwnership(ctx: UserCtx, next: any) {
  const appId = await utils.getAppIdFromCtx(ctx)
  if (!appId) {
    ctx.throw(400, "appId must be provided")
  }
  const exportAppId = tenancy.getTenantIDFromAppID(appId)
  const tenantId = tenancy.getTenantId()
  if (exportAppId !== tenantId) {
    ctx.throw(403, `Cannot export app from another tenant`)
  }
  await next()
}

export default ensureTenantAppOwnership
