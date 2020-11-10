/**
 * TODO: this entire file should be removed, this has simply been updated to fix a bug until SDK comes along fixing
 * all these sort of inconsistency issues.
 */
const COOKIE_SEPARATOR = ";"
const APP_PREFIX = "app_"
const KEY_VALUE_SPLIT = "="

function confirmAppId(possibleAppId) {
  return possibleAppId && possibleAppId.startsWith(APP_PREFIX)
    ? possibleAppId
    : undefined
}

function tryGetFromCookie() {
  const cookie = window.document.cookie
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

function getAppId() {
  const functions = [tryGetFromSubdomain, tryGetFromPath, tryGetFromCookie]
  // try getting the app Id in order
  let appId
  for (let func of functions) {
    appId = func()
    if (appId) {
      break
    }
  }
  return appId
}

const apiCall = method => async (
  url,
  body,
  headers = {
    "Content-Type": "application/json",
  }
) => {
  const appId = getAppId()
  if (appId) {
    headers["x-budibase-app-id"] = appId
  }
  return await fetch(url, {
    method: method,
    body: body && JSON.stringify(body),
    headers,
  })
}

export const post = apiCall("POST")
export const get = apiCall("GET")
export const patch = apiCall("PATCH")
export const del = apiCall("DELETE")
export const put = apiCall("PUT")

export default {
  post: apiCall("POST"),
  get: apiCall("GET"),
  patch: apiCall("PATCH"),
  delete: apiCall("DELETE"),
  put: apiCall("PUT"),
}
