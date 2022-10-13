const { StaticDatabases, doWithDB } = require("@budibase/backend-core/db")
const { getTenantId } = require("@budibase/backend-core/tenancy")
const { deleteTenant } = require("@budibase/backend-core/deprovision")
import { quotas } from "@budibase/pro"

export const exists = async (ctx: any) => {
  const tenantId = ctx.request.params
  ctx.body = {
    exists: await doWithDB(
      StaticDatabases.PLATFORM_INFO.name,
      async (db: any) => {
        let exists = false
        try {
          const tenantsDoc = await db.get(
            StaticDatabases.PLATFORM_INFO.docs.tenants
          )
          if (tenantsDoc) {
            exists = tenantsDoc.tenantIds.indexOf(tenantId) !== -1
          }
        } catch (err) {
          // if error it doesn't exist
        }
        return exists
      }
    ),
  }
}

export const fetch = async (ctx: any) => {
  ctx.body = await doWithDB(
    StaticDatabases.PLATFORM_INFO.name,
    async (db: any) => {
      let tenants = []
      try {
        const tenantsDoc = await db.get(
          StaticDatabases.PLATFORM_INFO.docs.tenants
        )
        if (tenantsDoc) {
          tenants = tenantsDoc.tenantIds
        }
      } catch (err) {
        // if error it doesn't exist
      }
      return tenants
    }
  )
}

const _delete = async (ctx: any) => {
  const tenantId = getTenantId()

  if (ctx.params.tenantId !== tenantId) {
    ctx.throw(403, "Unauthorized")
  }

  try {
    await deleteTenant(tenantId)
    await quotas.bustCache()
    ctx.status = 204
  } catch (err) {
    ctx.log.error(err)
    throw err
  }
}

export { _delete as delete }
