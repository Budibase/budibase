import { env, redis } from "@budibase/backend-core"

interface KoaRateLimitOptions {
  url: string
  password?: string
  username?: string
  database?: number
  socket?: {
    tls: boolean
    ca?: string
  }
}

export function getPublicApiRedisConfig(
  database?: number
): KoaRateLimitOptions {
  const { password, username } = redis.utils.getRedisConnectionDetails()
  const schemaMatch = /^[a-z]+:\/\//i
  const redisUrl = schemaMatch.test(env.REDIS_URL)
    ? env.REDIS_URL.replace(schemaMatch, match => match.toLowerCase())
    : `redis://${env.REDIS_URL}`
  const options: KoaRateLimitOptions = {
    url: redisUrl,
  }

  if (username) {
    options.username = username
  }

  if (password) {
    options.password = password
  }

  if (redisUrl.toLowerCase().startsWith("rediss://")) {
    options.socket = {
      tls: true,
    }
  }

  if (database != null) {
    options.database = database
  }

  return options
}
