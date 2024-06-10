import { tenancy } from "@budibase/backend-core"
import { TenantInfo, Ctx } from "@budibase/types"

export const save = async (ctx: Ctx<TenantInfo>) => {
  await tenancy.saveTenantInfo(ctx.request.body)
}
