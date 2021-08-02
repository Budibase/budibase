const {
  createTenancyContext,
  setTenantId,
} = require("../tenancy")
const { buildMatcherRegex, matches } = require("./matchers")

module.exports = (allowQueryStringPatterns, noTenancyPatterns) => {
  const allowQsOptions = buildMatcherRegex(allowQueryStringPatterns)
  const noTenancyOptions = buildMatcherRegex(noTenancyPatterns)

  return (ctx, next) => {
    // always run in context
    return createTenancyContext().runAndReturn(() => {
      if (matches(ctx, noTenancyOptions)) {
        return next()
      }

      const allowQs = !!matches(ctx, allowQsOptions)
      setTenantId(ctx, { allowQs })
      return next()
    })
  }
}
