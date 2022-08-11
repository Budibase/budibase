const { APP_DEV_PREFIX } = require("../db/utils")
const {
  doesUserHaveLock,
  updateLock,
  checkDebounce,
  setDebounce,
} = require("../utilities/redis")
const { doWithDB } = require("@budibase/backend-core/db")
const { DocumentType, getGlobalIDFromUserMetadataID } = require("../db/utils")
const { PermissionTypes } = require("@budibase/backend-core/permissions")
const { app: appCache } = require("@budibase/backend-core/cache")

const DEBOUNCE_TIME_SEC = 30

/************************************************** *
 * This middleware has been broken out of the       *
 * "authorized" middleware as it had nothing to do  *
 * with authorization, but requires the perms       *
 * imparted by it. This middleware shouldn't        *
 * be called directly, it should always be called   *
 * through the authorized middleware                *
 ****************************************************/

async function checkDevAppLocks(ctx) {
  const appId = ctx.appId

  // if any public usage, don't proceed
  if (!ctx.user._id && !ctx.user.userId) {
    return
  }

  // not a development app, don't need to do anything
  if (!appId || !appId.startsWith(APP_DEV_PREFIX)) {
    return
  }
  if (!(await doesUserHaveLock(appId, ctx.user))) {
    ctx.throw(400, "User does not hold app lock.")
  }

  // they do have lock, update it
  await updateLock(appId, ctx.user)
}

async function updateAppUpdatedAt(ctx) {
  const appId = ctx.appId
  // if debouncing skip this update
  // get methods also aren't updating
  if (ctx.method === "GET" || (await checkDebounce(appId))) {
    return
  }
  await doWithDB(appId, async db => {
    const metadata = await db.get(DocumentType.APP_METADATA)
    metadata.updatedAt = new Date().toISOString()

    metadata.updatedBy = getGlobalIDFromUserMetadataID(ctx.user.userId)

    const response = await db.put(metadata)
    metadata._rev = response.rev
    await appCache.invalidateAppMetadata(appId, metadata)
    // set a new debounce record with a short TTL
    await setDebounce(appId, DEBOUNCE_TIME_SEC)
  })
}

module.exports = async (ctx, permType) => {
  const appId = ctx.appId
  // this only functions within an app context
  if (!appId) {
    return
  }
  const isBuilderApi = permType === PermissionTypes.BUILDER
  const referer = ctx.headers["referer"]

  const overviewPath = "/builder/portal/overview/"
  const overviewContext = !referer ? false : referer.includes(overviewPath)
  if (overviewContext) {
    return
  }

  const hasAppId = !referer ? false : referer.includes(appId)
  const editingApp = referer ? hasAppId : false
  // check this is a builder call and editing
  if (!isBuilderApi || !editingApp) {
    return
  }
  // check locks
  await checkDevAppLocks(ctx)
  // set updated at time on app
  await updateAppUpdatedAt(ctx)
}
