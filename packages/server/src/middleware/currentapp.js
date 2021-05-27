const { getAppId, setCookie, getCookie } = require("@budibase/auth").utils
const { Cookies } = require("@budibase/auth").constants
const { getRole } = require("@budibase/auth/roles")
const { getGlobalUsers, getGlobalSelf } = require("../utilities/workerRequests")
const { BUILTIN_ROLE_IDS } = require("@budibase/auth/roles")
const { generateUserMetadataID } = require("../db/utils")

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
    roleId = BUILTIN_ROLE_IDS.PUBLIC
  if (!ctx.user) {
    // not logged in, try to set a cookie for public apps
    updateCookie = true
    appId = requestAppId
  } else if (
    requestAppId != null &&
    (appCookie == null ||
      requestAppId !== appCookie.appId ||
      appCookie.roleId === BUILTIN_ROLE_IDS.PUBLIC ||
      !appCookie.roleId)
  ) {
    // Different App ID means cookie needs reset, or if the same public user has logged in
    const globalUser = await getGlobalSelf(ctx, requestAppId)
    updateCookie = true
    appId = requestAppId
    // retrieving global user gets the right role
    roleId = globalUser.roleId
  } else if (appCookie != null) {
    appId = appCookie.appId
    roleId = appCookie.roleId || BUILTIN_ROLE_IDS.PUBLIC
  }
  // nothing more to do
  if (!appId) {
    return next()
  }

  ctx.appId = appId
  if (roleId) {
    ctx.roleId = roleId
    const userId = ctx.user ? generateUserMetadataID(ctx.user._id) : null
    ctx.user = {
      ...ctx.user,
      // override userID with metadata one
      _id: userId,
      userId,
      roleId,
      role: await getRole(appId, roleId),
    }
  }
  if (updateCookie) {
    setCookie(ctx, { appId, roleId }, Cookies.CurrentApp)
  }
  return next()
}
