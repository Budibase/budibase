const { Header } = require("@budibase/backend-core/constants")
const { getAppIdFromCtx } = require("@budibase/backend-core/utils")

module.exports = function ({ requiresAppId } = {}) {
  return async (ctx, next) => {
    const appId = await getAppIdFromCtx(ctx)
    if (requiresAppId && !appId) {
      ctx.throw(
        400,
        `Invalid app ID provided, please check the ${Header.APP_ID} header.`
      )
    }
    if (!ctx.headers[Header.API_KEY]) {
      ctx.throw(
        400,
        `Invalid API key provided, please check the ${Header.API_KEY} header.`
      )
    }
    return next()
  }
}
