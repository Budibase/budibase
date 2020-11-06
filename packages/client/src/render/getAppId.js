const COOKIE_SEPARATOR = ";"
const APP_PREFIX = "app_"
const KEY_VALUE_SPLIT = "="

export const getAppId = allCookies => {
  const cookie = allCookies
    .split(COOKIE_SEPARATOR)
    .find(cookie => cookie.trim().startsWith("budibase:currentapp"))
  let appId = location.pathname.split("/")[1]
  appId = appId && appId.startsWith(APP_PREFIX) ? appId : undefined
  if (!appId && cookie && cookie.split(KEY_VALUE_SPLIT).length === 2) {
    appId = cookie.split("=")[1]
  }
  return appId
}

export const getAppIdFromPath = getAppId
