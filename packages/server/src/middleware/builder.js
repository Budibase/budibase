const { APP_DEV_PREFIX } = require("../db/utils")
const {
  doesUserHaveLock,
  updateLock,
  checkDebounce,
  setDebounce,
} = require("../utilities/redis")
const CouchDB = require("../db")
const { DocumentTypes } = require("../db/utils")
const { PermissionTypes } = require("@budibase/auth/permissions")

const DEBOUNCE_TIME_SEC = 20

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
    ctx.throw(403, "User does not hold app lock.")
  }

  // they do have lock, update it
  await updateLock(appId, ctx.user)
}

async function updateAppUpdatedAt(ctx) {
  const appId = ctx.appId
  // if debouncing skip this update
  // get methods also aren't updating
  if ((await checkDebounce(appId)) || ctx.method === "GET") {
    return
  }
  const db = new CouchDB(appId)
  const metadata = await db.get(DocumentTypes.APP_METADATA)
  metadata.updatedAt = new Date().toISOString()
  await db.put(metadata)
  // set a new debounce record with a short TTL
  await setDebounce(appId, DEBOUNCE_TIME_SEC)
}

module.exports = async (ctx, permType) => {
  const appId = ctx.appId
  // this only functions within an app context
  if (!appId) {
    return
  }
  const isBuilderApi = permType === PermissionTypes.BUILDER
  const referer = ctx.headers["referer"]
  const editingApp = referer ? referer.includes(appId) : false
  // check this is a builder call and editing
  if (!isBuilderApi || !editingApp) {
    return
  }
  // check locks
  await checkDevAppLocks(ctx)
  // set updated at time on app
  await updateAppUpdatedAt(ctx)
}
