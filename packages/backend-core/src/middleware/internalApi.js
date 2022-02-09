const env = require("../environment")
const { Headers } = require("../constants")

/**
 * API Key only endpoint.
 */
module.exports = async (ctx, next) => {
  const apiKey = ctx.request.headers[Headers.API_KEY]
  if (apiKey !== env.INTERNAL_API_KEY) {
    ctx.throw(403, "Unauthorized")
  }

  return next()
}
