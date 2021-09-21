const env = require("../../environment")

exports.isEnabled = async function (ctx) {
  ctx.body = {
    enabled: !env.SELF_HOSTED && env.ENABLE_ANALYTICS === "true",
  }
}
