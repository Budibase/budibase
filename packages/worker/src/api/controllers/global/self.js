const {
  getGlobalDB,
  getTenantId,
  isUserInAppTenant,
} = require("@budibase/backend-core/tenancy")
const { generateDevInfoID, SEPARATOR } = require("@budibase/backend-core/db")
const { user: userCache } = require("@budibase/backend-core/cache")
const {
  hash,
  platformLogout,
  getCookie,
  clearCookie,
} = require("@budibase/backend-core/utils")
const { encrypt } = require("@budibase/backend-core/encryption")
const { newid } = require("@budibase/backend-core/utils")
const { users } = require("../../../sdk")
const { Cookies } = require("@budibase/backend-core/constants")
const { events, featureFlags } = require("@budibase/backend-core")

function newApiKey() {
  return encrypt(`${getTenantId()}${SEPARATOR}${newid()}`)
}

function cleanupDevInfo(info) {
  // user doesn't need to aware of dev doc info
  delete info._id
  delete info._rev
  return info
}

exports.generateAPIKey = async ctx => {
  const db = getGlobalDB()
  const id = generateDevInfoID(ctx.user._id)
  let devInfo
  try {
    devInfo = await db.get(id)
  } catch (err) {
    devInfo = { _id: id, userId: ctx.user._id }
  }
  devInfo.apiKey = await newApiKey()
  await db.put(devInfo)
  ctx.body = cleanupDevInfo(devInfo)
}

exports.fetchAPIKey = async ctx => {
  const db = getGlobalDB()
  const id = generateDevInfoID(ctx.user._id)
  let devInfo
  try {
    devInfo = await db.get(id)
  } catch (err) {
    devInfo = {
      _id: id,
      userId: ctx.user._id,
      apiKey: await newApiKey(),
    }
    await db.put(devInfo)
  }
  ctx.body = cleanupDevInfo(devInfo)
}

const checkCurrentApp = ctx => {
  const appCookie = getCookie(ctx, Cookies.CurrentApp)
  if (appCookie && !isUserInAppTenant(appCookie.appId)) {
    // there is a currentapp cookie from another tenant
    // remove the cookie as this is incompatible with the builder
    // due to builder and admin permissions being removed
    clearCookie(ctx, Cookies.CurrentApp)
  }
}

/**
 * Add the attributes that are session based to the current user.
 */
const addSessionAttributesToUser = ctx => {
  ctx.body.account = ctx.user.account
  ctx.body.license = ctx.user.license
  ctx.body.budibaseAccess = !!ctx.user.budibaseAccess
  ctx.body.accountPortalAccess = !!ctx.user.accountPortalAccess
  ctx.body.csrfToken = ctx.user.csrfToken
}

/**
 * Remove the attributes that are session based from the current user,
 * so that stale values are not written to the db
 */
const removeSessionAttributesFromUser = ctx => {
  delete ctx.request.body.csrfToken
  delete ctx.request.body.account
  delete ctx.request.body.accountPortalAccess
  delete ctx.request.body.budibaseAccess
  delete ctx.request.body.license
}

exports.getSelf = async ctx => {
  if (!ctx.user) {
    ctx.throw(403, "User not logged in")
  }
  const userId = ctx.user._id
  ctx.params = {
    id: userId,
  }

  checkCurrentApp(ctx)

  // get the main body of the user
  ctx.body = await users.getUser(userId)

  // add the feature flags for this tenant
  const tenantId = getTenantId()
  ctx.body.featureFlags = featureFlags.getTenantFeatureFlags(tenantId)

  addSessionAttributesToUser(ctx)
}

exports.updateSelf = async ctx => {
  const db = getGlobalDB()
  const user = await db.get(ctx.user._id)
  let passwordChange = false
  if (ctx.request.body.password) {
    // changing password
    passwordChange = true
    ctx.request.body.password = await hash(ctx.request.body.password)
    // Log all other sessions out apart from the current one
    await platformLogout({
      ctx,
      userId: ctx.user._id,
      keepActiveSession: true,
    })
  }
  // don't allow sending up an ID/Rev, always use the existing one
  delete ctx.request.body._id
  delete ctx.request.body._rev
  removeSessionAttributesFromUser(ctx)

  const response = await db.put({
    ...user,
    ...ctx.request.body,
  })
  await userCache.invalidateUser(user._id)
  ctx.body = {
    _id: response.id,
    _rev: response.rev,
  }

  // remove the old password from the user before sending events
  delete user.password
  await events.user.updated(user)
  if (passwordChange) {
    await events.user.passwordUpdated(user)
  }
}
