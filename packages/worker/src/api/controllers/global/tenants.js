const env = require("../../../environment")
const CouchDB = require("../../../db")
const { StaticDatabases } = require("@budibase/auth/db")

exports.multiTenancyEnabled = async ctx => {
  ctx.body = {
    enabled: false,
  }
}

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
