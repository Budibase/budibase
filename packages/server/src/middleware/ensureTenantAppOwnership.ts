import { tenancy } from "@budibase/backend-core"
import { UserCtx } from "@budibase/types"

function ensureTenantAppOwnership(appIdGetter: (ctx: UserCtx) => string) {
  return async (ctx: UserCtx, next: any) => {
    const appId = appIdGetter(ctx)
    const exportAppId = tenancy.getTenantIDFromAppID(appId)
    const tenantId = tenancy.getTenantId()
    if (exportAppId !== tenantId) {
      ctx.throw(403, `Cannot export app from another tenant`)
    }
    await next()
  }
}

export default ensureTenantAppOwnership
