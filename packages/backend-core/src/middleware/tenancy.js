const { setTenantId, setGlobalDB, getGlobalDB } = require("../tenancy")
const { closeDB } = require("../db")
const ContextFactory = require("../context/FunctionContext")
const { buildMatcherRegex, matches } = require("./matchers")

module.exports = (
  allowQueryStringPatterns,
  noTenancyPatterns,
  opts = { noTenancyRequired: false }
) => {
  const allowQsOptions = buildMatcherRegex(allowQueryStringPatterns)
  const noTenancyOptions = buildMatcherRegex(noTenancyPatterns)

  const updateCtxFn = ctx => {
    const allowNoTenant =
      opts.noTenancyRequired || !!matches(ctx, noTenancyOptions)
    const allowQs = !!matches(ctx, allowQsOptions)
    const tenantId = setTenantId(ctx, { allowQs, allowNoTenant })
    setGlobalDB(tenantId)
  }
  const destroyFn = async () => {
    const db = getGlobalDB()
    await closeDB(db)
  }

  return ContextFactory.getMiddleware(updateCtxFn, destroyFn)
}
