import { context, tenancy, utils } from "@budibase/backend-core"
import { UserCtx } from "@budibase/types"

export async function ensureTenantAppOwnershipMiddleware(
  ctx: UserCtx,
  next: any
) {
  const appId = await utils.getAppIdFromCtx(ctx)
  if (!appId) {
    ctx.throw(400, "appId must be provided")
  }

  const appTenantId = context.getTenantIDFromWorkspaceID(appId)
  const tenantId = tenancy.getTenantId()

  if (appTenantId !== tenantId) {
    ctx.throw(403, "Unauthorized")
  }
  await next()
}
