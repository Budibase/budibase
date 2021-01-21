const env = require("../environment")
const hosting = require("../utilities/builder/hosting")
// if added as a middleware will stop requests unless builder is in self host mode
// or cloud is in self host
module.exports = async (ctx, next) => {
  if (env.CLOUD && env.SELF_HOSTED) {
    await next()
    return
  }
  const hostingInfo = await hosting.getHostingInfo()
  if (hostingInfo.type === hosting.HostingTypes.SELF) {
    await next()
    return
  }
  ctx.throw(400, "Endpoint unavailable in cloud hosting.")
}
