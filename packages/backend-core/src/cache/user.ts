import * as redis from "../redis/init"
import { getTenantId, lookupTenantId, doWithGlobalDB } from "../tenancy"
import env from "../environment"
import * as accounts from "../cloud/accounts"
import { Database } from "@budibase/types"

const EXPIRY_SECONDS = 3600

/**
 * The default populate user function
 */
async function populateFromDB(userId: string, tenantId: string) {
  const user = await doWithGlobalDB(tenantId, (db: Database) => db.get(userId))
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
      tenantId = getTenantId()
    } catch (err) {
      tenantId = await lookupTenantId(userId)
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
  return user
}

export async function invalidateUser(userId: string) {
  const client = await redis.getUserClient()
  await client.delete(userId)
}
