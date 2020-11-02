const env = require("../environment")

exports.wait = ms => new Promise(resolve => setTimeout(resolve, ms))

exports.isDev = () => {
  return (
    !env.CLOUD &&
    env.NODE_ENV !== "production" &&
    env.NODE_ENV !== "jest" &&
    env.NODE_ENV !== "cypress"
  )
}

/**
 * Given a request tries to find the appId, which can be located in various places
 * @param {object} ctx The main request body to look through.
 * @returns {string|undefined} If an appId was found it will be returned.
 */
exports.getAppId = ctx => {
  let appId = env.CLOUD ? ctx.subdomains[1] : ctx.params.appId
  // look in body if can't find it in subdomain
  if (!appId && ctx.request.body && ctx.request.body.appId) {
    appId = ctx.request.body.appId
  }
  // if appId can't be determined from path param or subdomain
  if (!appId && ctx.request.headers.referer) {
    const url = new URL(ctx.request.headers.referer)
    // remove leading and trailing slashes from appId
    appId = url.pathname.replace(/\//g, "")
  }
  return appId
}

/**
 * Get the name of the cookie which is to be updated/retrieved
 * @param {string|undefined|null} appId OPTIONAL can specify the specific app if previewing etc
 * @returns {string} The name of the token trying to find
 */
exports.getCookieName = (appId = null) => {
  let mid = env.CLOUD ? "cloud" : "local"
  return `budibase:${mid}:${appId ? appId : "builder"}`
}
