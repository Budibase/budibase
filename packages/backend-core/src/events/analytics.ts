import env from "../environment"
import * as tenancy from "../tenancy"
import * as dbUtils from "../db/utils"
import { Configs } from "../constants"

// TODO: cache in redis
export const enabled = async () => {
  // cloud - always use the environment variable
  if (!env.SELF_HOSTED) {
    return !!env.ENABLE_ANALYTICS
  }

  // self host - prefer the settings doc
  // check for explicit true/false values to support
  // backwards compatibility where setting may not exist
  const settings = await getSettingsDoc()
  if (settings?.config?.analyticsEnabled === false) {
    return false
  } else if (settings?.config?.analyticsEnabled === true) {
    return true
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
    settings = await db.get(
      dbUtils.generateConfigID({ type: Configs.SETTINGS })
    )
  } catch (e: any) {
    if (e.status !== 404) {
      throw e
    }
  }
  return settings
}
