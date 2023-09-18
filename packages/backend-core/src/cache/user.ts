import * as redis from "../redis/init"
import * as tenancy from "../tenancy"
import * as context from "../context"
import * as platform from "../platform"
import env from "../environment"
import * as accounts from "../accounts"
import { UserDB } from "../users"
import { sdk } from "@budibase/shared-core"

const EXPIRY_SECONDS = 3600

/**
 * The default populate user function
 */
async function populateFromDB(userId: string, tenantId: string) {
  const db = tenancy.getTenantDB(tenantId)
  const user = await db.get<any>(userId)
  user.budibaseAccess = true
  if (!env.SELF_HOSTED && !env.DISABLE_ACCOUNT_PORTAL) {
    const account = await accounts.getAccount(user.email)
    if (account) {
      user.account = account
      user.accountPortalAccess = true
    }
  }

  return user
}

async function populateUsersFromDB(userIds: string[], tenantId: string) {
  const db = tenancy.getTenantDB(tenantId)
  const allDocsResponse = await db.allDocs<any>({
    keys: userIds,
    include_docs: true,
    limit: userIds.length,
  })

  const users = allDocsResponse.rows.map(r => r.doc)
  await Promise.all(
    users.map(async user => {
      user.budibaseAccess = true
      if (!env.SELF_HOSTED && !env.DISABLE_ACCOUNT_PORTAL) {
        const account = await accounts.getAccount(user.email)
        if (account) {
          user.account = account
          user.accountPortalAccess = true
        }
      }
    })
  )

  return users
}

/**
 * Get the requested user by id.
 * Use redis cache to first read the user.
 * If not present fallback to loading the user directly and re-caching.
 * @param {*} userId the id of the user to get
 * @param {*} tenantId the tenant of the user to get
 * @param {*} populateUser function to provide the user for re-caching. default to couch db
 * @returns
 */
export async function getUser(
  userId: string,
  tenantId?: string,
  populateUser?: any
) {
  if (!populateUser) {
    populateUser = populateFromDB
  }
  if (!tenantId) {
    try {
      tenantId = context.getTenantId()
    } catch (err) {
      tenantId = await platform.users.lookupTenantId(userId)
    }
  }
  const client = await redis.getUserClient()
  // try cache
  let user = await client.get(userId)
  if (!user) {
    user = await populateUser(userId, tenantId)
    await client.store(userId, user, EXPIRY_SECONDS)
  }
  if (user && !user.tenantId && tenantId) {
    // make sure the tenant ID is always correct/set
    user.tenantId = tenantId
  }
  // if has groups, could have builder permissions granted by a group
  if (user.userGroups && !sdk.users.isGlobalBuilder(user)) {
    await context.doInTenant(tenantId, async () => {
      const appIds = await UserDB.getGroupBuilderAppIds(user)
      if (appIds.length) {
        const existing = user.builder?.apps || []
        user.builder = {
          apps: [...new Set(existing.concat(appIds))],
        }
      }
    })
  }
  return user
}

/**
 * Get the requested users by id.
 * Use redis cache to first read the users.
 * If not present fallback to loading the users directly and re-caching.
 * @param {*} userIds the ids of the user to get
 * @param {*} tenantId the tenant of the users to get
 * @returns
 */
export async function getUsers(userIds: string[], tenantId: string) {
  const client = await redis.getUserClient()
  // try cache
  let usersFromCache = await client.bulkGet(userIds)
  const missingUsersFromCache = userIds.filter(uid => !usersFromCache[uid])
  const usersFromDb = await populateUsersFromDB(missingUsersFromCache, tenantId)
  for (const userToCache of usersFromDb) {
    await client.store(userToCache._id, userToCache, EXPIRY_SECONDS)
  }
  const users = [...Object.values(usersFromCache), ...usersFromDb]
  return users
}

export async function invalidateUser(userId: string) {
  const client = await redis.getUserClient()
  await client.delete(userId)
}
