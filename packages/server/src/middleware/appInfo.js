const { isDevAppID, isProdAppID } = require("../db/utils")

exports.AppType = {
  DEV: "dev",
  PROD: "prod",
}

exports.middleware =
  ({ appType } = {}) =>
  (ctx, next) => {
    const appId = ctx.appId
    if (appType === exports.AppType.DEV && appId && !isDevAppID(appId)) {
      ctx.throw(400, "Only apps in development support this endpoint")
    }
    if (appType === exports.AppType.PROD && appId && !isProdAppID(appId)) {
      ctx.throw(400, "Only apps in production support this endpoint")
    }
    return next()
  }
