const cls = require("cls-hooked")
const env = require("../environment")
const { Headers } = require("../../constants")

exports.DEFAULT_TENANT_ID = "default"

exports.isDefaultTenant = () => {
  return exports.getTenantId() === exports.DEFAULT_TENANT_ID
}

exports.isMultiTenant = () => {
  return env.MULTI_TENANCY
}

// continuation local storage
const CONTEXT_NAME = "tenancy"
const TENANT_ID = "tenantId"

exports.createTenancyContext = () => {
  return cls.createNamespace(CONTEXT_NAME)
}

const getTenancyContext = () => {
  return cls.getNamespace(CONTEXT_NAME)
}

// used for automations, API endpoints should always be in context already
exports.doInTenant = (tenantId, task) => {
  const context = getTenancyContext()
  return getTenancyContext().runAndReturn(() => {
    // set the tenant id
    context.set(TENANT_ID, tenantId)

    // invoke the task
    const result = task()

    // clear down the tenant id manually for extra safety
    // this should also happen automatically when the call exits
    context.set(TENANT_ID, null)

    return result
  })
}

exports.updateTenantId = tenantId => {
  getTenancyContext().set(TENANT_ID, tenantId)
}

exports.setTenantId = (ctx, opts = { allowQs: false }) => {
  let tenantId
  // exit early if not multi-tenant
  if (!exports.isMultiTenant()) {
    getTenancyContext().set(TENANT_ID, this.DEFAULT_TENANT_ID)
    return
  }

  const params = ctx.request.params || {}
  const header = ctx.request.headers[Headers.TENANT_ID]
  const user = ctx.request.user || {}
  tenantId = user.tenantId || params.tenantId || header
  if (opts.allowQs && !tenantId) {
    const query = ctx.request.query || {}
    tenantId = query.tenantId
  }

  if (!tenantId) {
    ctx.throw(403, "Tenant id not set")
  }

  getTenancyContext().set(TENANT_ID, tenantId)
}

exports.isTenantIdSet = () => {
  const tenantId = getTenancyContext().get(TENANT_ID)
  return !!tenantId
}

exports.getTenantId = () => {
  if (!exports.isMultiTenant()) {
    return exports.DEFAULT_TENANT_ID
  }
  const tenantId = getTenancyContext().get(TENANT_ID)
  if (!tenantId) {
    throw Error("Tenant id not found")
  }
  return tenantId
}