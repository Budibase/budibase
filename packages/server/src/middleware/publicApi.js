const { Headers } = require("@budibase/backend-core/constants")
const { getAppIdFromCtx } = require("@budibase/backend-core/utils")

module.exports = function ({ requiresAppId } = {}) {
  return async (ctx, next) => {
    const appId = await getAppIdFromCtx(ctx)
    if (requiresAppId && !appId) {
      ctx.throw(
        400,
        `Invalid app ID provided, please check the ${Headers.APP_ID} header.`
      )
    }
    if (!ctx.headers[Headers.API_KEY]) {
      ctx.throw(
        400,
        `Invalid API key provided, please check the ${Headers.API_KEY} header.`
      )
    }
    return next()
  }
}
