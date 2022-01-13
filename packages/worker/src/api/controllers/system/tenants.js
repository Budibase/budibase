const CouchDB = require("../../../db")
const { StaticDatabases } = require("@budibase/backend-core/db")
const { getTenantId } = require("@budibase/backend-core/tenancy")
const { deleteTenant } = require("@budibase/backend-core/deprovision")

exports.exists = async ctx => {
  const tenantId = ctx.request.params
  const db = new CouchDB(StaticDatabases.PLATFORM_INFO.name)
  let exists = false
  try {
    const tenantsDoc = await db.get(StaticDatabases.PLATFORM_INFO.docs.tenants)
    if (tenantsDoc) {
      exists = tenantsDoc.tenantIds.indexOf(tenantId) !== -1
    }
  } catch (err) {
    // if error it doesn't exist
  }
  ctx.body = {
    exists,
  }
}

exports.fetch = async ctx => {
  const db = new CouchDB(StaticDatabases.PLATFORM_INFO.name)
  let tenants = []
  try {
    const tenantsDoc = await db.get(StaticDatabases.PLATFORM_INFO.docs.tenants)
    if (tenantsDoc) {
      tenants = tenantsDoc.tenantIds
    }
  } catch (err) {
    // if error it doesn't exist
  }
  ctx.body = tenants
}

exports.delete = async ctx => {
  const tenantId = getTenantId()

  if (ctx.params.tenantId !== tenantId) {
    ctx.throw(403, "Unauthorized")
  }

  try {
    await deleteTenant(tenantId)
    ctx.status = 204
  } catch (err) {
    ctx.log.error(err)
    throw err
  }
}
