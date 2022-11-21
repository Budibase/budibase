import {
  APP_DEV_PREFIX,
  DocumentType,
  getGlobalIDFromUserMetadataID,
} from "../db/utils"
import {
  doesUserHaveLock,
  updateLock,
  checkDebounce,
  setDebounce,
} from "../utilities/redis"
import { db as dbCore, cache, permissions } from "@budibase/backend-core"
import { BBContext, Database } from "@budibase/types"

const DEBOUNCE_TIME_SEC = 30

/************************************************** *
 * This middleware has been broken out of the       *
 * "authorized" middleware as it had nothing to do  *
 * with authorization, but requires the perms       *
 * imparted by it. This middleware shouldn't        *
 * be called directly, it should always be called   *
 * through the authorized middleware                *
 ****************************************************/

async function checkDevAppLocks(ctx: BBContext) {
  const appId = ctx.appId

  // if any public usage, don't proceed
  if (!ctx.user?._id && !ctx.user?.userId) {
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

async function updateAppUpdatedAt(ctx: BBContext) {
  const appId = ctx.appId
  // if debouncing skip this update
  // get methods also aren't updating
  if (ctx.method === "GET" || (await checkDebounce(appId))) {
    return
  }
  await dbCore.doWithDB(appId, async (db: Database) => {
    const metadata = await db.get(DocumentType.APP_METADATA)
    metadata.updatedAt = new Date().toISOString()

    metadata.updatedBy = getGlobalIDFromUserMetadataID(ctx.user?.userId!)

    const response = await db.put(metadata)
    metadata._rev = response.rev
    await cache.app.invalidateAppMetadata(appId, metadata)
    // set a new debounce record with a short TTL
    await setDebounce(appId, DEBOUNCE_TIME_SEC)
  })
}

export = async function builder(ctx: BBContext, permType: string) {
  const appId = ctx.appId
  // this only functions within an app context
  if (!appId) {
    return
  }
  const isBuilderApi = permType === permissions.PermissionType.BUILDER
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
