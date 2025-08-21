import { tenancy, utils, context } from "@budibase/backend-core"
import { UserCtx } from "@budibase/types"

export async function ensureTenantAppOwnershipMiddleware(
  ctx: UserCtx,
  next: any
) {
  const appId = await utils.getAppIdFromCtx(ctx)
  if (!appId) {
    ctx.throw(400, "appId must be provided")
  }

  const appTenantId = context.getTenantIDFromAppID(appId)
  const tenantId = tenancy.getTenantId()

  if (appTenantId !== tenantId) {
    ctx.throw(403, "Unauthorized")
  }
  await next()
}
