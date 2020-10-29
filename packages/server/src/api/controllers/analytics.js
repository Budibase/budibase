const env = require("../../environment")

exports.isEnabled = async function(ctx) {
  ctx.body = JSON.stringify(env.ENABLE_ANALYTICS === "true")
}
