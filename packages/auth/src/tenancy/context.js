const env = require("../environment")
const { Headers } = require("../../constants")
const cls = require("./FunctionContext")

exports.DEFAULT_TENANT_ID = "default"

exports.isDefaultTenant = () => {
  return exports.getTenantId() === exports.DEFAULT_TENANT_ID
}

exports.isMultiTenant = () => {
  return env.MULTI_TENANCY
}

const TENANT_ID = "tenantId"

// used for automations, API endpoints should always be in context already
exports.doInTenant = (tenantId, task) => {
  return cls.run(() => {
    // set the tenant id
    cls.setOnContext(TENANT_ID, tenantId)

    // invoke the task
    return task()
  })
}

exports.updateTenantId = tenantId => {
  cls.setOnContext(TENANT_ID, tenantId)
}

exports.setTenantId = (
  ctx,
  opts = { allowQs: false, allowNoTenant: false }
) => {
  let tenantId
  // exit early if not multi-tenant
  if (!exports.isMultiTenant()) {
    cls.setOnContext(TENANT_ID, this.DEFAULT_TENANT_ID)
    return
  }

  const allowQs = opts && opts.allowQs
  const allowNoTenant = opts && opts.allowNoTenant
  const header = ctx.request.headers[Headers.TENANT_ID]
  const user = ctx.user || {}
  if (allowQs) {
    const query = ctx.request.query || {}
    tenantId = query.tenantId
  }
  // override query string (if allowed) by user, or header
  // URL params cannot be used in a middleware, as they are
  // processed later in the chain
  tenantId = user.tenantId || header || tenantId

  // Set the tenantId from the subdomain
  if (!tenantId) {
    tenantId = ctx.subdomains && ctx.subdomains[0]
  }

  if (!tenantId && !allowNoTenant) {
    ctx.throw(403, "Tenant id not set")
  }
  // check tenant ID just incase no tenant was allowed
  if (tenantId) {
    cls.setOnContext(TENANT_ID, tenantId)
  }
}

exports.isTenantIdSet = () => {
  const tenantId = cls.getFromContext(TENANT_ID)
  return !!tenantId
}

exports.getTenantId = () => {
  if (!exports.isMultiTenant()) {
    return exports.DEFAULT_TENANT_ID
  }
  const tenantId = cls.getFromContext(TENANT_ID)
  if (!tenantId) {
    throw Error("Tenant id not found")
  }
  return tenantId
}
