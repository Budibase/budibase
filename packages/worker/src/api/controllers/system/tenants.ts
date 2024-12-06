import { GetTenantInfoResponse, UserCtx } from "@budibase/types"
import * as tenantSdk from "../../../sdk/tenants"

export async function destroy(ctx: UserCtx<void, void>) {
  const user = ctx.user!
  const tenantId = ctx.params.tenantId

  if (!ctx.internal && tenantId !== user.tenantId) {
    ctx.throw(403, "Tenant ID does not match current user")
  }

  try {
    await tenantSdk.deleteTenant(tenantId)
    ctx.status = 204
  } catch (err) {
    ctx.log.error(err)
    throw err
  }
}

export async function info(ctx: UserCtx<void, GetTenantInfoResponse>) {
  ctx.body = await tenantSdk.tenantInfo(ctx.params.tenantId)
}
