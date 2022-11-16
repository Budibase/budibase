const { doInTenant, isMultiTenant, DEFAULT_TENANT_ID } = require("../tenancy")
const { buildMatcherRegex, matches } = require("./matchers")
const { Header } = require("../constants")

const getTenantID = (ctx, opts = { allowQs: false, allowNoTenant: false }) => {
  // exit early if not multi-tenant
  if (!isMultiTenant()) {
    return DEFAULT_TENANT_ID
  }

  let tenantId
  const allowQs = opts && opts.allowQs
  const allowNoTenant = opts && opts.allowNoTenant
  const header = ctx.request.headers[Header.TENANT_ID]
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

  return tenantId
}

module.exports = (
  allowQueryStringPatterns,
  noTenancyPatterns,
  opts = { noTenancyRequired: false }
) => {
  const allowQsOptions = buildMatcherRegex(allowQueryStringPatterns)
  const noTenancyOptions = buildMatcherRegex(noTenancyPatterns)

  return async function (ctx, next) {
    const allowNoTenant =
      opts.noTenancyRequired || !!matches(ctx, noTenancyOptions)
    const allowQs = !!matches(ctx, allowQsOptions)
    const tenantId = getTenantID(ctx, { allowQs, allowNoTenant })
    return doInTenant(tenantId, next)
  }
}
