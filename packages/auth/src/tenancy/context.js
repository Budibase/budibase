const cls = require("cls-hooked")
const env = require("../environment")
const { Headers } = require("../constants")

exports.DEFAULT_TENANT_ID = "default"

exports.isDefaultTenant = () => {
  return exports.getTenantId() === exports.DEFAULT_TENANT_ID
}

exports.isMultiTenant = () => {
  return env.MULTI_TENANCY
}

// access tenant id strategies

exports.REQUEST_STRATEGY = "request"
exports.SESSION_STRATEGY = "session"

// continuation local storage

const CONTEXT_NAME = "tenancy"
const TENANT_ID = "tenantId"

exports.createTenancyContext = () => {
  return cls.createNamespace(CONTEXT_NAME)
}

const getTenancyContext = () => {
  return cls.getNamespace(CONTEXT_NAME)
}

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

exports.setTenantId = (ctx, strategy = this.SESSION_STRATEGY) => {
  let tenantId
  // exit early if not multi-tenant
  if (!this.isMultiTenant()) {
    getTenancyContext().set(TENANT_ID, this.DEFAULT_TENANT_ID)
    return
  }

  // pre-auth
  if (strategy === this.REQUEST_STRATEGY) {
    const params = ctx.request.params || {}
    const query = ctx.request.query || {}
    const header = ctx.request.headers[Headers.TENANT_ID]

    tenantId = params.tenantId || query.tenantId || header
  }

  // post-auth
  if (strategy === this.SESSION_STRATEGY) {
    const user = ctx.request.user || {}
    tenantId = user.tenantId
  }

  if (!tenantId) {
    ctx.throw(403, "Tenant id not set")
  }

  getTenancyContext().set(TENANT_ID, tenantId)
}

exports.getTenantId = () => {
  const tenantId = getTenancyContext().get(TENANT_ID)
  if (!tenantId) {
    throw Error("Tenant id not found")
  }
  return tenantId
}
