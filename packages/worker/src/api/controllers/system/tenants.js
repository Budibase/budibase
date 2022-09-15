const { StaticDatabases, doWithDB } = require("@budibase/backend-core/db")
const { getTenantId } = require("@budibase/backend-core/tenancy")
const { deleteTenant } = require("@budibase/backend-core/deprovision")
const { quotas } = require("@budibase/pro")

exports.exists = async ctx => {
  const tenantId = ctx.request.params
  ctx.body = {
    exists: await doWithDB(StaticDatabases.PLATFORM_INFO.name, async db => {
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
    }),
  }
}

exports.fetch = async ctx => {
  ctx.body = await doWithDB(StaticDatabases.PLATFORM_INFO.name, async db => {
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
  })
}

exports.delete = async ctx => {
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
