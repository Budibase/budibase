const { getAppId, setCookie, getCookie, clearCookie } =
  require("@budibase/auth").utils
const { Cookies } = require("@budibase/auth").constants
const { getRole } = require("@budibase/auth/roles")
const { BUILTIN_ROLE_IDS } = require("@budibase/auth/roles")
const { generateUserMetadataID } = require("../db/utils")
const { dbExists, getTenantIDFromAppID } = require("@budibase/auth/db")
const { getTenantId } = require("@budibase/auth/tenancy")
const { getCachedSelf } = require("../utilities/global")
const CouchDB = require("../db")
const env = require("../environment")

const DEFAULT_TENANT_ID = "default"

module.exports = async (ctx, next) => {
  // try to get the appID from the request
  let requestAppId = getAppId(ctx)
  // get app cookie if it exists
  let appCookie = null
  try {
    appCookie = getCookie(ctx, Cookies.CurrentApp)
  } catch (err) {
    clearCookie(ctx, Cookies.CurrentApp)
  }
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
    // if the request app ID wasn't set, update it with the cookie
    requestAppId = requestAppId || appId
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

  // If user and app tenant Ids do not match, 403
  if (env.MULTI_TENANCY && ctx.user) {
    const userTenantId = getTenantId()
    const tenantId = getTenantIDFromAppID(appId) || DEFAULT_TENANT_ID
    if (tenantId !== userTenantId) {
      ctx.throw(403, "Cannot access application.")
    }
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
