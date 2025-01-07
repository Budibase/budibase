import * as userSdk from "../../../sdk/users"
import {
  features,
  tenancy,
  db as dbCore,
  utils,
  encryption,
  auth as authCore,
} from "@budibase/backend-core"
import env from "../../../environment"
import { groups } from "@budibase/pro"
import {
  DevInfo,
  FetchAPIKeyResponse,
  GenerateAPIKeyRequest,
  GenerateAPIKeyResponse,
  GetGlobalSelfResponse,
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

export async function generateAPIKey(
  ctx: UserCtx<GenerateAPIKeyRequest, GenerateAPIKeyResponse>
) {
  let userId
  let apiKey
  if (env.isTest() && ctx.request.body.userId) {
    userId = ctx.request.body.userId
    apiKey = newTestApiKey()
  } else {
    userId = ctx.user._id!
    apiKey = newApiKey()
  }

  const db = tenancy.getGlobalDB()
  const id = dbCore.generateDevInfoID(userId)
  let devInfo: DevInfo
  try {
    devInfo = await db.get<DevInfo>(id)
  } catch (err) {
    devInfo = { _id: id, userId }
  }
  devInfo.apiKey = apiKey
  await db.put(devInfo)
  ctx.body = cleanupDevInfo(devInfo)
}

export async function fetchAPIKey(ctx: UserCtx<void, FetchAPIKeyResponse>) {
  const db = tenancy.getGlobalDB()
  const id = dbCore.generateDevInfoID(ctx.user._id!)
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
 *
 */
const getUserSessionAttributes = (ctx: any) => ({
  account: ctx.user.account,
  license: ctx.user.license,
  budibaseAccess: !!ctx.user.budibaseAccess,
  accountPortalAccess: !!ctx.user.accountPortalAccess,
  csrfToken: ctx.user.csrfToken,
})

export async function getSelf(ctx: UserCtx<void, GetGlobalSelfResponse>) {
  if (!ctx.user) {
    ctx.throw(403, "User not logged in")
  }
  const userId = ctx.user._id!
  ctx.params = {
    id: userId,
  }

  // Adjust creators quotas (prevents wrong creators count if user has changed the plan)
  await groups.adjustGroupCreatorsQuotas()

  // get the main body of the user
  const user = await userSdk.db.getUser(userId)
  const enrichedUser = await groups.enrichUserRolesFromGroups(user)

  // add the attributes that are session based to the current user
  const sessionAttributes = getUserSessionAttributes(ctx)

  // add the feature flags for this tenant
  const flags = await features.flags.fetch()

  ctx.body = {
    ...enrichedUser,
    ...sessionAttributes,
    flags,
  }
}

export const syncAppFavourites = async (processedAppIds: string[]) => {
  if (processedAppIds.length === 0) {
    return []
  }

  const tenantId = tenancy.getTenantId()
  const appPrefix =
    tenantId === tenancy.DEFAULT_TENANT_ID
      ? dbCore.APP_DEV_PREFIX
      : `${dbCore.APP_DEV_PREFIX}${tenantId}_`

  const apps = await fetchAppsByIds(processedAppIds, appPrefix)
  return apps?.reduce((acc: string[], app) => {
    const id = app.appId.replace(appPrefix, "")
    if (processedAppIds.includes(id)) {
      acc.push(id)
    }
    return acc
  }, [])
}

export const fetchAppsByIds = async (
  processedAppIds: string[],
  appPrefix: string
) => {
  return await dbCore.getAppsByIDs(
    processedAppIds.map(appId => {
      return `${appPrefix}${appId}`
    })
  )
}

const processUserAppFavourites = async (
  user: User,
  update: UpdateSelfRequest
) => {
  if (!("appFavourites" in update)) {
    // Ignore requests without an explicit update to favourites.
    return
  }

  const userAppFavourites = user.appFavourites || []
  const requestAppFavourites = new Set(update.appFavourites || [])
  const containsAll = userAppFavourites.every(v => requestAppFavourites.has(v))

  if (containsAll && requestAppFavourites.size === userAppFavourites.length) {
    // Ignore request if the outcome will have no change
    return
  }

  // Clean up the request by purging apps that no longer exist.
  const syncedAppFavourites = await syncAppFavourites([...requestAppFavourites])
  return syncedAppFavourites
}

export async function updateSelf(
  ctx: UserCtx<UpdateSelfRequest, UpdateSelfResponse>
) {
  const update = ctx.request.body

  let user = await userSdk.db.getUser(ctx.user._id!)
  const updatedAppFavourites = await processUserAppFavourites(user, update)

  user = {
    ...user,
    ...update,
    ...(updatedAppFavourites ? { appFavourites: updatedAppFavourites } : {}),
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
