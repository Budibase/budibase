import { tenancy } from "@budibase/backend-core"
import { TenantInfo, Ctx } from "@budibase/types"

export const save = async (ctx: Ctx<TenantInfo>) => {
  const response = await tenancy.saveTenantInfo(ctx.request.body)
  ctx.body = {
    _id: response.id,
    _rev: response.rev,
  }
}
