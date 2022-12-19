import { APP_DEV_PREFIX, APP_PREFIX } from "../constants"
import { App } from "@budibase/types"
const NO_APP_ERROR = "No app provided"

export function isDevAppID(appId?: string) {
  if (!appId) {
    throw NO_APP_ERROR
  }
  return appId.startsWith(APP_DEV_PREFIX)
}

export function isProdAppID(appId?: string) {
  if (!appId) {
    throw NO_APP_ERROR
  }
  return appId.startsWith(APP_PREFIX) && !isDevAppID(appId)
}

export function isDevApp(app: App) {
  if (!app) {
    throw NO_APP_ERROR
  }
  return isDevAppID(app.appId)
}

/**
 * Generates a development app ID from a real app ID.
 * @returns {string} the dev app ID which can be used for dev database.
 */
export function getDevelopmentAppID(appId: string) {
  if (!appId || appId.startsWith(APP_DEV_PREFIX)) {
    return appId
  }
  // split to take off the app_ element, then join it together incase any other app_ exist
  const split = appId.split(APP_PREFIX)
  split.shift()
  const rest = split.join(APP_PREFIX)
  return `${APP_DEV_PREFIX}${rest}`
}
export const getDevAppID = getDevelopmentAppID

/**
 * Convert a development app ID to a deployed app ID.
 */
export function getProdAppID(appId: string) {
  if (!appId || !appId.startsWith(APP_DEV_PREFIX)) {
    return appId
  }
  // split to take off the app_dev element, then join it together incase any other app_ exist
  const split = appId.split(APP_DEV_PREFIX)
  split.shift()
  const rest = split.join(APP_DEV_PREFIX)
  return `${APP_PREFIX}${rest}`
}

export function extractAppUUID(id: string) {
  const split = id?.split("_") || []
  return split.length ? split[split.length - 1] : null
}
