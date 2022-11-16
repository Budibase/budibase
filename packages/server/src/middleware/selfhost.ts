const env = require("../environment")
// if added as a middleware will stop requests unless builder is in self host mode
// or cloud is in self host
module.exports = async (ctx, next) => {
  if (env.SELF_HOSTED) {
    await next()
    return
  }
  ctx.throw(400, "Endpoint unavailable in cloud hosting.")
}
