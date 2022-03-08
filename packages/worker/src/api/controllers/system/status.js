const accounts = require("@budibase/backend-core/accounts")
const env = require("../../../environment")

exports.fetch = async ctx => {
  if (!env.SELF_HOSTED && !env.DISABLE_ACCOUNT_PORTAL) {
    const status = await accounts.getStatus()
    ctx.body = status
  } else {
    ctx.body = {
      health: {
        passing: true,
      },
    }
  }
}
