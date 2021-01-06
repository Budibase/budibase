const env = require("../environment")

module.exports = async (ctx, next) => {
  if (
    !ctx.request.body.selfHostKey ||
    env.SELF_HOST_KEY !== ctx.request.body.selfHostKey
  ) {
    ctx.throw(401, "Deployment unauthorised")
  } else {
    await next()
  }
}
