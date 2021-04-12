const { getAppId, setCookie, getCookie, Cookies } = require("@budibase/auth")
const { getGlobalUsers } = require("../utilities/workerRequests")
const { BUILTIN_ROLE_IDS } = require("../utilities/security/roles")

function CurrentAppCookie(appId, roleId) {
  this.appId = appId
  this.roleId = roleId
}

function finish(ctx, next, { appId, roleId, cookie = false }) {
  if (appId) {
    ctx.appId = appId
  }
  if (roleId) {
    ctx.roleId = roleId
  }
  if (cookie && appId) {
    setCookie(ctx, new CurrentAppCookie(appId, roleId))
  }
  return next()
}

module.exports = async (ctx, next) => {
  // try to get the appID from the request
  const requestAppId = getAppId(ctx)
  // get app cookie if it exists
  const appCookie = getCookie(ctx, Cookies.CurrentApp)
  if (!appCookie && !requestAppId) {
    return next()
  }

  let updateCookie = false,
    appId,
    roleId
  if (!ctx.user) {
    // not logged in, try to set a cookie for public apps
    updateCookie = true
    appId = requestAppId
    roleId = BUILTIN_ROLE_IDS.PUBLIC
  } else if (
    requestAppId != null &&
    (appCookie == null || requestAppId === appCookie.appId)
  ) {
    const globalUser = await getGlobalUsers(ctx, requestAppId, ctx.user.email)
    updateCookie = true
    appId = requestAppId
    roleId = globalUser.roles[requestAppId] || BUILTIN_ROLE_IDS.PUBLIC
  } else if (requestAppId == null && appCookie != null) {
    appId = appCookie.appId
    roleId = appCookie.roleId || BUILTIN_ROLE_IDS.PUBLIC
  }
  return finish(ctx, next, {
    appId: appId,
    roleId: roleId,
    cookie: updateCookie,
  })
}
