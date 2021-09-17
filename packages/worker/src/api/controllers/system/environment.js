const env = require("../../../environment")

exports.fetch = async ctx => {
  ctx.body = {
    multiTenancy: !!env.MULTI_TENANCY,
    cloud: !(env.SELF_HOSTED === "1"),
    accountPortalUrl: env.ACCOUNT_PORTAL_URL,
  }
}
