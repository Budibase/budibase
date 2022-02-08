const { setTenantId } = require("../tenancy")
const ContextFactory = require("../context/FunctionContext")
const { buildMatcherRegex, matches } = require("./matchers")

module.exports = (
  allowQueryStringPatterns,
  noTenancyPatterns,
  opts = { noTenancyRequired: false }
) => {
  const allowQsOptions = buildMatcherRegex(allowQueryStringPatterns)
  const noTenancyOptions = buildMatcherRegex(noTenancyPatterns)

  return ContextFactory.getMiddleware(ctx => {
    const allowNoTenant =
      opts.noTenancyRequired || !!matches(ctx, noTenancyOptions)
    const allowQs = !!matches(ctx, allowQsOptions)
    setTenantId(ctx, { allowQs, allowNoTenant })
  })
}
