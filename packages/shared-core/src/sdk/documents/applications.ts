import { DocumentType, prefixed } from "@budibase/types"

const APP_PREFIX = prefixed(DocumentType.APP)
const APP_DEV_PREFIX = prefixed(DocumentType.APP_DEV)

export function getDevAppID(appId: string) {
  if (!appId) {
    throw new Error("No app ID provided")
  }
  if (appId.startsWith(APP_DEV_PREFIX)) {
    return appId
  }
  // split to take off the app_ element, then join it together incase any other app_ exist
  const split = appId.split(APP_PREFIX)
  split.shift()
  const rest = split.join(APP_PREFIX)
  return `${APP_DEV_PREFIX}${rest}`
}

/**
 * Convert a development app ID to a deployed app ID.
 */
export function getProdAppID(appId: string) {
  if (!appId) {
    throw new Error("No app ID provided")
  }
  if (!appId.startsWith(APP_DEV_PREFIX)) {
    return appId
  }
  // split to take off the app_dev element, then join it together incase any other app_ exist
  const split = appId.split(APP_DEV_PREFIX)
  split.shift()
  const rest = split.join(APP_DEV_PREFIX)
  return `${APP_PREFIX}${rest}`
}
