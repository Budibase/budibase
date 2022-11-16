const env = require("../environment")
const { Header } = require("@budibase/backend-core/constants")

/**
 * This is a restricted endpoint in the cloud.
 * Ensure that the correct API key has been supplied.
 */
module.exports = async (ctx, next) => {
  if (!env.SELF_HOSTED && !env.DISABLE_ACCOUNT_PORTAL) {
    const apiKey = ctx.request.headers[Header.API_KEY]
    if (apiKey !== env.INTERNAL_API_KEY) {
      ctx.throw(403, "Unauthorized")
    }
  }

  return next()
}
