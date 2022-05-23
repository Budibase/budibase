const redis = require("../redis/authRedis")
const env = require("../environment")
const { getTenantId } = require("../context")

exports.CacheKeys = {
  CHECKLIST: "checklist",
}

exports.TTL = {
  ONE_MINUTE: 600,
}

function generateTenantKey(key) {
  const tenantId = getTenantId()
  return `${key}:${tenantId}`
}

exports.withCache = async (key, ttl, fetchFn) => {
  key = generateTenantKey(key)
  const client = await redis.getCacheClient()
  const cachedValue = await client.get(key)
  if (cachedValue) {
    return cachedValue
  }

  try {
    const fetchedValue = await fetchFn()

    if (!env.isTest()) {
      await client.store(key, fetchedValue, ttl)
    }
    return fetchedValue
  } catch (err) {
    console.error("Error fetching before cache - ", err)
    throw err
  }
}

exports.bustCache = async key => {
  const client = await redis.getCacheClient()
  try {
    await client.delete(generateTenantKey(key))
  } catch (err) {
    console.error("Error busting cache - ", err)
    throw err
  }
}
