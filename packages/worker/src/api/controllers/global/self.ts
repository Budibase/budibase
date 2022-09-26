import sdk from "../../../sdk"
import {
  events,
  featureFlags,
  tenancy,
  constants,
  db as dbCore,
  utils,
  cache,
  encryption,
} from "@budibase/backend-core"
import env from "../../../environment"
import { groups } from "@budibase/pro"
const { hash, platformLogout, getCookie, clearCookie, newid } = utils
const { user: userCache } = cache

function newTestApiKey() {
  return env.ENCRYPTED_TEST_PUBLIC_API_KEY
}

function newApiKey() {
  return encryption.encrypt(
    `${tenancy.getTenantId()}${dbCore.SEPARATOR}${newid()}`
  )
}

function cleanupDevInfo(info: any) {
  // user doesn't need to aware of dev doc info
  delete info._id
  delete info._rev
  return info
}

export async function generateAPIKey(ctx: any) {
  let userId
  let apiKey
  if (env.isTest() && ctx.request.body.userId) {
    userId = ctx.request.body.userId
    apiKey = newTestApiKey()
  } else {
    userId = ctx.user._id
    apiKey = newApiKey()
  }

  const db = tenancy.getGlobalDB()
  const id = dbCore.generateDevInfoID(userId)
  let devInfo
  try {
    devInfo = await db.get(id)
  } catch (err) {
    devInfo = { _id: id, userId }
  }
  devInfo.apiKey = await apiKey
  await db.put(devInfo)
  ctx.body = cleanupDevInfo(devInfo)
}

export async function fetchAPIKey(ctx: any) {
  const db = tenancy.getGlobalDB()
  const id = dbCore.generateDevInfoID(ctx.user._id)
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

const checkCurrentApp = (ctx: any) => {
  const appCookie = getCookie(ctx, constants.Cookies.CurrentApp)
  if (appCookie && !tenancy.isUserInAppTenant(appCookie.appId)) {
    // there is a currentapp cookie from another tenant
    // remove the cookie as this is incompatible with the builder
    // due to builder and admin permissions being removed
    clearCookie(ctx, constants.Cookies.CurrentApp)
  }
}

/**
 * Add the attributes that are session based to the current user.
 */
const addSessionAttributesToUser = (ctx: any) => {
  ctx.body.account = ctx.user.account
  ctx.body.license = ctx.user.license
  ctx.body.budibaseAccess = !!ctx.user.budibaseAccess
  ctx.body.accountPortalAccess = !!ctx.user.accountPortalAccess
  ctx.body.csrfToken = ctx.user.csrfToken
}

const sanitiseUserUpdate = (ctx: any) => {
  const allowed = ["firstName", "lastName", "password", "forceResetPassword"]
  const resp: { [key: string]: any } = {}
  for (let [key, value] of Object.entries(ctx.request.body)) {
    if (allowed.includes(key)) {
      resp[key] = value
    }
  }
  return resp
}

export async function getSelf(ctx: any) {
  if (!ctx.user) {
    ctx.throw(403, "User not logged in")
  }
  const userId = ctx.user._id
  ctx.params = {
    id: userId,
  }

  checkCurrentApp(ctx)

  // get the main body of the user
  const user = await sdk.users.getUser(userId)
  ctx.body = await groups.enrichUserRolesFromGroups(user)

  // add the feature flags for this tenant
  const tenantId = tenancy.getTenantId()
  ctx.body.featureFlags = featureFlags.getTenantFeatureFlags(tenantId)

  addSessionAttributesToUser(ctx)
}

export async function updateSelf(ctx: any) {
  const db = tenancy.getGlobalDB()
  const user = await db.get(ctx.user._id)
  let passwordChange = false

  const userUpdateObj = sanitiseUserUpdate(ctx)
  if (userUpdateObj.password) {
    // changing password
    passwordChange = true
    userUpdateObj.password = await hash(userUpdateObj.password)
    // Log all other sessions out apart from the current one
    await platformLogout({
      ctx,
      userId: ctx.user._id,
      keepActiveSession: true,
    })
  }

  const response = await db.put({
    ...user,
    ...userUpdateObj,
  })
  await userCache.invalidateUser(user._id)
  ctx.body = {
    _id: response.id,
    _rev: response.rev,
  }

  // remove the old password from the user before sending events
  user._rev = response.rev
  delete user.password
  await events.user.updated(user)
  if (passwordChange) {
    await events.user.passwordUpdated(user)
  }
}
