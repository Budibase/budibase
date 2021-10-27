const env = require("../../../environment")

exports.fetch = async ctx => {
  ctx.body = {
    multiTenancy: !!env.MULTI_TENANCY,
    cloud: !env.SELF_HOSTED,
    accountPortalUrl: env.ACCOUNT_PORTAL_URL,
    disableAccountPortal: env.DISABLE_ACCOUNT_PORTAL,
    isDev: env.isDev(),
  }
}
