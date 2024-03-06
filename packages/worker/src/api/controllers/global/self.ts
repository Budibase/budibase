import * as userSdk from "../../../sdk/users"
import {
  featureFlags,
  tenancy,
  db as dbCore,
  utils,
  encryption,
  auth as authCore,
} from "@budibase/backend-core"
import env from "../../../environment"
import { groups } from "@budibase/pro"
import {
  UpdateSelfRequest,
  UpdateSelfResponse,
  User,
  UserCtx,
} from "@budibase/types"

const { newid } = utils

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
    devInfo = await db.get<any>(id)
  } catch (err) {
    devInfo = { _id: id, userId }
  }
  devInfo.apiKey = apiKey
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
      apiKey: newApiKey(),
    }
    await db.put(devInfo)
  }
  ctx.body = cleanupDevInfo(devInfo)
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

export async function getSelf(ctx: any) {
  if (!ctx.user) {
    ctx.throw(403, "User not logged in")
  }
  const userId = ctx.user._id
  ctx.params = {
    id: userId,
  }

  // Adjust creators quotas (prevents wrong creators count if user has changed the plan)
  await groups.adjustGroupCreatorsQuotas()

  // get the main body of the user
  const user = await userSdk.db.getUser(userId)
  ctx.body = await groups.enrichUserRolesFromGroups(user)

  // add the feature flags for this tenant
  const tenantId = tenancy.getTenantId()
  ctx.body.featureFlags = featureFlags.getTenantFeatureFlags(tenantId)

  addSessionAttributesToUser(ctx)
}

export const syncAppFavourites = async (processedAppIds: string[]) => {
  const apps = await fetchAppsByIds(processedAppIds)
  return apps?.reduce((acc: string[], app) => {
    const id = app.appId.replace(dbCore.APP_DEV_PREFIX, "")
    if (processedAppIds.includes(id)) {
      acc.push(id)
    }
    return acc
  }, [])
}

export const fetchAppsByIds = async (processedAppIds: string[]) => {
  return await dbCore.getAppsByIDs(
    processedAppIds.map(appId => `${dbCore.APP_DEV_PREFIX}${appId}`)
  )
}

const processUserAppFavourites = (
  user: User,
  appIdRequest: string[] | undefined
) => {
  const userAppFavourites = user.appFavourites || []
  const appFavouritesRequest = appIdRequest || []
  const appFavouritesUpdated = [
    ...new Set(userAppFavourites.concat(appFavouritesRequest)),
  ]

  // Process state
  let processedAppIds: string[]
  if (userAppFavourites.length) {
    const req = new Set(appFavouritesRequest)
    const updated = new Set(userAppFavourites)
    for (const element of req) {
      if (updated.has(element)) {
        // Subtract/Toggle any existing ones
        updated.delete(element)
      } else {
        // Add new appIds
        updated.add(element)
      }
    }
    processedAppIds = [...updated]
  } else {
    processedAppIds = [...appFavouritesUpdated]
  }
  return processedAppIds
}

export async function updateSelf(
  ctx: UserCtx<UpdateSelfRequest, UpdateSelfResponse>
) {
  const update = ctx.request.body

  let user = await userSdk.db.getUser(ctx.user._id!)

  if ("appFavourites" in update) {
    const appIds: string[] = processUserAppFavourites(
      user,
      update.appFavourites
    )
    const validAppIds: string[] = await syncAppFavourites(appIds)

    user = {
      ...user,
      appFavourites: validAppIds,
    }
  } else {
    user = {
      ...user,
      ...update,
    }
  }

  user = await userSdk.db.save(user, { requirePassword: false })

  if (update.password) {
    // Log all other sessions out apart from the current one
    await authCore.platformLogout({
      ctx,
      userId: ctx.user._id!,
      keepActiveSession: true,
    })
  }

  ctx.body = {
    _id: user._id!,
    _rev: user._rev!,
  }
}

// export default {
//   generateAPIKey,
//   fetchAPIKey,
//   getSelf,
//   syncAppFavourites,
//   fetchAppsByIds,
//   updateSelf,
// }
