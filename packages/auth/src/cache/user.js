const redis = require("../redis/authRedis")
const { getTenantId, lookupTenantId, getGlobalDB } = require("../tenancy")

const EXPIRY_SECONDS = 3600

/**
 * The default populate user function
 */
const populateFromDB = async (userId, tenantId) => {
  const user = await getGlobalDB(tenantId).get(userId)
  user.budibaseAccess = true
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
exports.getUser = async (
  userId,
  tenantId = null,
  populateUser = populateFromDB
) => {
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
    client.store(userId, user, EXPIRY_SECONDS)
  }
  if (user && !user.tenantId && tenantId) {
    // make sure the tenant ID is always correct/set
    user.tenantId = tenantId
  }
  return user
}

exports.invalidateUser = async userId => {
  const client = await redis.getUserClient()
  await client.delete(userId)
}
