const accounts = require("@budibase/backend-core/accounts")
const env = require("../../../environment")

exports.fetch = async ctx => {
  if (!env.SELF_HOSTED) {
    const status = await accounts.getStatus()
    ctx.body = status
  }
}
