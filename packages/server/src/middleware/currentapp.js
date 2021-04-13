const { getAppId, setCookie, getCookie, Cookies } = require("@budibase/auth")
const { getRole } = require("../utilities/security/roles")
const { generateUserMetadataID } = require("../db/utils")
const { getGlobalUsers } = require("../utilities/workerRequests")
const { BUILTIN_ROLE_IDS } = require("../utilities/security/roles")

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
    (appCookie == null ||
      requestAppId !== appCookie.appId ||
      appCookie.roleId === BUILTIN_ROLE_IDS.PUBLIC)
  ) {
    // Different App ID means cookie needs reset, or if the same public user has logged in
    const globalUser = await getGlobalUsers(ctx, requestAppId, ctx.user.email)
    updateCookie = true
    appId = requestAppId
    roleId = globalUser.roles[requestAppId] || BUILTIN_ROLE_IDS.PUBLIC
  } else if (appCookie != null) {
    appId = appCookie.appId
    roleId = appCookie.roleId || BUILTIN_ROLE_IDS.PUBLIC
  }
  if (appId) {
    ctx.appId = appId
    if (roleId) {
      const userId = ctx.user
        ? generateUserMetadataID(ctx.user.email)
        : undefined
      ctx.roleId = roleId
      ctx.user = {
        ...ctx.user,
        _id: userId,
        userId,
        role: await getRole(appId, roleId),
      }
    }
  }
  if (updateCookie && appId) {
    setCookie(ctx, { appId, roleId }, Cookies.CurrentApp)
  }
  return next()
}
