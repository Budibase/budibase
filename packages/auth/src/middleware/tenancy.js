const {
  createTenancyContext,
  setTenantId,
  REQUEST_STRATEGY,
  SESSION_STRATEGY,
} = require("../tenancy")
const { buildMatcherRegex, matches } = require("./matchers")

exports.requestTenancy = noTenancyPatterns => {
  const noTenancyOptions = buildMatcherRegex(noTenancyPatterns)

  return (ctx, next) => {
    // exit early if no tenancy is required
    if (matches(ctx, noTenancyOptions)) {
      return next()
    }

    return createTenancyContext().runAndReturn(() => {
      setTenantId(ctx, REQUEST_STRATEGY)
      return next()
    })
  }
}

exports.sessionTenancy = noTenancyPatterns => {
  const noTenancyOptions = buildMatcherRegex(noTenancyPatterns)

  return (ctx, next) => {
    // exit early if no tenancy is required
    if (matches(ctx, noTenancyOptions)) {
      return next()
    }

    setTenantId(ctx, SESSION_STRATEGY)
    return next()
  }
}
