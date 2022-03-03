const cache = require("../cache")

const buildLicensingMiddleware = opts => {
  return async (ctx, next) => {
    if (ctx.user) {
      const tenantId = ctx.user.tenantId
      const license = await cache.getLicense(tenantId, opts)
      if (license) {
        ctx.user.license = license
      }
    }

    return next()
  }
}

module.exports = buildLicensingMiddleware
