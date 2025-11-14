import { GetTenantInfoResponse, UserCtx } from "@budibase/types"
import { LockRequest, LockReason } from "@budibase/types"
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

export async function lock(ctx: UserCtx<LockRequest, void>) {
  if (!ctx.internal) {
    ctx.throw(403, "Only internal user can lock a tenant")
  }

  const { reason } = ctx.request.body
  if (reason !== undefined && !Object.values(LockReason).includes(reason)) {
    ctx.throw(
      400,
      `Invalid lock reason. Valid values: ${Object.values(LockReason).join(", ")}`
    )
  }

  const tenantId = ctx.params.tenantId

  try {
    if (reason) {
      await tenantSdk.lockTenant(tenantId, reason)
    } else {
      await tenantSdk.unlockTenant(tenantId)
    }
    ctx.status = 204
  } catch (err) {
    ctx.log.error(err)
    throw err
  }
}

export async function info(ctx: UserCtx<void, GetTenantInfoResponse>) {
  ctx.body = await tenantSdk.tenantInfo(ctx.params.tenantId)
}
