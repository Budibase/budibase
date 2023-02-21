import { UserCtx } from "@budibase/types"
import * as tenantSdk from "../../../sdk/tenants"

export async function destroy(ctx: UserCtx) {
  const user = ctx.user!
  const tenantId = ctx.params.tenantId

  if (tenantId !== user.tenantId) {
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
