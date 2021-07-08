const { getAppId, setCookie, getCookie, clearCookie } =
  require("@budibase/auth").utils
const { Cookies } = require("@budibase/auth").constants
const { getRole } = require("@budibase/auth/roles")
const { BUILTIN_ROLE_IDS } = require("@budibase/auth/roles")
const { generateUserMetadataID } = require("../db/utils")
const { dbExists } = require("@budibase/auth/db")
const { getCachedSelf } = require("../utilities/global")
const CouchDB = require("../db")

module.exports = async (ctx, next) => {
  // try to get the appID from the request
  const requestAppId = getAppId(ctx)
  // get app cookie if it exists
  const appCookie = getCookie(ctx, Cookies.CurrentApp)
  if (!appCookie && !requestAppId) {
    return next()
  }
  // check the app exists referenced in cookie
  if (appCookie) {
    const appId = appCookie.appId
    const exists = await dbExists(CouchDB, appId)
    if (!exists) {
      clearCookie(ctx, Cookies.CurrentApp)
      return next()
    }
  }

  let appId,
    roleId = BUILTIN_ROLE_IDS.PUBLIC
  if (!ctx.user) {
    // not logged in, try to set a cookie for public apps
    appId = requestAppId
  } else if (requestAppId != null) {
    // Different App ID means cookie needs reset, or if the same public user has logged in
    const globalUser = await getCachedSelf(ctx, requestAppId)
    appId = requestAppId
    // retrieving global user gets the right role
    roleId = globalUser.roleId || BUILTIN_ROLE_IDS.BASIC
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
  if (
    requestAppId !== appId ||
    appCookie == null ||
    appCookie.appId !== requestAppId
  ) {
    setCookie(ctx, { appId }, Cookies.CurrentApp)
  }
  return next()
}
