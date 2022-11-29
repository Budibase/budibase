import env from "../environment"
import * as tenancy from "../tenancy"
import * as dbUtils from "../db/utils"
import { Config } from "../constants"
import { withCache, TTL, CacheKey } from "../cache"

export const enabled = async () => {
  // cloud - always use the environment variable
  if (!env.SELF_HOSTED) {
    return !!env.ENABLE_ANALYTICS
  }

  // self host - prefer the settings doc
  // use cache as events have high throughput
  const enabledInDB = await withCache(
    CacheKey.ANALYTICS_ENABLED,
    TTL.ONE_DAY,
    async () => {
      const settings = await getSettingsDoc()

      // need to do explicit checks in case the field is not set
      if (settings?.config?.analyticsEnabled === false) {
        return false
      } else if (settings?.config?.analyticsEnabled === true) {
        return true
      }
    }
  )

  if (enabledInDB !== undefined) {
    return enabledInDB
  }

  // fallback to the environment variable
  // explicitly check for 0 or false here, undefined or otherwise is treated as true
  const envEnabled: any = env.ENABLE_ANALYTICS
  if (envEnabled === 0 || envEnabled === false) {
    return false
  } else {
    return true
  }
}

const getSettingsDoc = async () => {
  const db = tenancy.getGlobalDB()
  let settings
  try {
    settings = await db.get(dbUtils.generateConfigID({ type: Config.SETTINGS }))
  } catch (e: any) {
    if (e.status !== 404) {
      throw e
    }
  }
  return settings
}
