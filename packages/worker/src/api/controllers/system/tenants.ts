import { BBContext } from "@budibase/types"
import { deprovisioning } from "@budibase/backend-core"
import { quotas } from "@budibase/pro"

const _delete = async (ctx: BBContext) => {
  const user = ctx.user!
  const tenantId = ctx.params.tenantId

  if (tenantId !== user.tenantId) {
    ctx.throw(403, "Tenant ID does not match current user")
  }

  try {
    await deprovisioning.deleteTenant(tenantId)
    await quotas.bustCache()
    ctx.status = 204
  } catch (err) {
    ctx.log.error(err)
    throw err
  }
}

export { _delete as delete }
