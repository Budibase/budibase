const { getGlobalDB } = require("../db/utils")
const redis = require("../redis/authRedis")
const { lookupTenantId } = require("../utils")

const EXPIRY_SECONDS = 3600

exports.getUser = async (userId, tenantId = null) => {
  if (!tenantId) {
    tenantId = await lookupTenantId({ userId })
  }
  const client = await redis.getUserClient()
  // try cache
  let user = await client.get(userId)
  if (!user) {
    user = await getGlobalDB(tenantId).get(userId)
    client.store(userId, user, EXPIRY_SECONDS)
  }
  return user
}

exports.invalidateUser = async userId => {
  const client = await redis.getUserClient()
  await client.delete(userId)
}
