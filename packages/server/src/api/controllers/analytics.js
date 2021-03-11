const env = require("../../environment")

exports.isEnabled = async function(ctx) {
  ctx.body = {
    enabled: env.ENABLE_ANALYTICS === "true",
  }
}
