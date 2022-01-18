const {
  getAppId,
  setCookie,
  getCookie,
  clearCookie,
} = require("@budibase/backend-core/utils")
const { Cookies } = require("@budibase/backend-core/constants")
const { getRole } = require("@budibase/backend-core/roles")
const { BUILTIN_ROLE_IDS } = require("@budibase/backend-core/roles")
const { generateUserMetadataID, isDevAppID } = require("../db/utils")
const { dbExists } = require("@budibase/backend-core/db")
const { isUserInAppTenant } = require("@budibase/backend-core/tenancy")
const { getCachedSelf } = require("../utilities/global")
const CouchDB = require("../db")
const env = require("../environment")
const { isWebhookEndpoint } = require("./utils")

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

  // deny access to application preview
  if (
    isDevAppID(requestAppId) &&
    !isWebhookEndpoint(ctx) &&
    (!ctx.user || !ctx.user.builder || !ctx.user.builder.global)
  ) {
    clearCookie(ctx, Cookies.CurrentApp)
    // have to set the return url on the server side as client side is not available
    setCookie(ctx, ctx.url, Cookies.RETURN_URL, {
      // don't sign so the browser can easily read
      sign: false,
      // use the request domain to match how ui handles the return url cookie.
      // it's important we don't use the shared domain here as the builder
      // can't delete from it without awareness of the domain.
      requestDomain: true,
    })
    return ctx.redirect("/")
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
    roleId = globalUser.roleId || roleId
  }

  // nothing more to do
  if (!appId) {
    return next()
  }

  let noCookieSet = false
  // if the user not in the right tenant then make sure they have no permissions
  // need to judge this only based on the request app ID,
  if (
    env.MULTI_TENANCY &&
    ctx.user &&
    requestAppId &&
    !isUserInAppTenant(requestAppId)
  ) {
    // don't error, simply remove the users rights (they are a public user)
    delete ctx.user.builder
    delete ctx.user.admin
    delete ctx.user.roles
    roleId = BUILTIN_ROLE_IDS.PUBLIC
    noCookieSet = true
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
    (requestAppId !== appId ||
      appCookie == null ||
      appCookie.appId !== requestAppId) &&
    !noCookieSet
  ) {
    setCookie(ctx, { appId }, Cookies.CurrentApp)
  }

  return next()
}
