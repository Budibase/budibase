const env = require("../environment")

module.exports = async (ctx, next) => {
  const selfHostKey =
    ctx.request.headers["x-budibase-auth"] || ctx.request.body.selfHostKey
  if (!selfHostKey || env.SELF_HOST_KEY !== selfHostKey) {
    ctx.throw(401, "Request unauthorised")
  } else {
    await next()
  }
}
