const { setTenantId, setGlobalDB, closeTenancy } = require("../tenancy")
const cls = require("../context/FunctionContext")
const { buildMatcherRegex, matches } = require("./matchers")

module.exports = (
  allowQueryStringPatterns,
  noTenancyPatterns,
  opts = { noTenancyRequired: false }
) => {
  const allowQsOptions = buildMatcherRegex(allowQueryStringPatterns)
  const noTenancyOptions = buildMatcherRegex(noTenancyPatterns)

  return async function (ctx, next) {
    return cls.run(async () => {
      const allowNoTenant =
        opts.noTenancyRequired || !!matches(ctx, noTenancyOptions)
      const allowQs = !!matches(ctx, allowQsOptions)
      const tenantId = setTenantId(ctx, { allowQs, allowNoTenant })
      setGlobalDB(tenantId)
      const res = await next()
      await closeTenancy()
      return res
    })
  }
}
