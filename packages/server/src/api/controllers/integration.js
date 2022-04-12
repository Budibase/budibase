const { cloneDeep } = require("lodash")
const { definitions } = require("../../integrations")
const { getTenantId } = require("@budibase/backend-core/tenancy")
const { SourceNames } = require("../../definitions/datasource")
const googlesheets = require("../../integrations/googlesheets")
const env = require("../../environment")

exports.fetch = async function (ctx) {
  ctx.status = 200
  const defs = cloneDeep(definitions)

  // for google sheets integration google verification
  if (env.EXCLUDE_QUOTAS_TENANTS) {
    const excludedTenants = env.EXCLUDE_QUOTAS_TENANTS.split(",")
    const tenantId = getTenantId()
    if (excludedTenants.includes(tenantId)) {
      defs[SourceNames.GOOGLE_SHEETS] = googlesheets.schema
    }
  }

  ctx.body = defs
}

exports.find = async function (ctx) {
  ctx.status = 200
  ctx.body = definitions[ctx.params.type]
}
