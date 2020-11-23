const COOKIE_SEPARATOR = ";"
const APP_PREFIX = "app_"
const KEY_VALUE_SPLIT = "="

function confirmAppId(possibleAppId) {
  return possibleAppId && possibleAppId.startsWith(APP_PREFIX)
    ? possibleAppId
    : undefined
}

function tryGetFromCookie({ cookies }) {
  if (!cookies) {
    return undefined
  }
  const cookie = cookies
    .split(COOKIE_SEPARATOR)
    .find(cookie => cookie.trim().startsWith("budibase:currentapp"))
  let appId
  if (cookie && cookie.split(KEY_VALUE_SPLIT).length === 2) {
    appId = cookie.split("=")[1]
  }
  return confirmAppId(appId)
}

function tryGetFromPath() {
  const appId = location.pathname.split("/")[1]
  return confirmAppId(appId)
}

function tryGetFromSubdomain() {
  const parts = window.location.host.split(".")
  const appId = parts[1] ? parts[0] : undefined
  return confirmAppId(appId)
}

export const getAppId = (cookies = window.document.cookie) => {
  const functions = [tryGetFromSubdomain, tryGetFromPath, tryGetFromCookie]
  // try getting the app Id in order
  let appId
  for (let func of functions) {
    appId = func({ cookies })
    if (appId) {
      break
    }
  }
  return appId
}
