import { tenancy } from "@budibase/backend-core"
import { TenantInfo, Ctx } from "@budibase/types"

export const save = async (ctx: Ctx<TenantInfo>) => {
  const response = await tenancy.saveTenantInfo(ctx.request.body)
  ctx.body = {
    _id: response.id,
    _rev: response.rev,
  }
}

export const get = async (ctx: Ctx) => {
  const response = await tenancy.getTenantInfo(ctx.params.id)
  if (response) {
    ctx.body = response
  } else {
    ctx.throw(400, "Tenant info not found.")
  }
}
