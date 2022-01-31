const NO_APP_ERROR = "No app provided"
const { APP_DEV_PREFIX, APP_PREFIX } = require("./constants")

exports.isDevAppID = appId => {
  if (!appId) {
    throw NO_APP_ERROR
  }
  return appId.startsWith(APP_DEV_PREFIX)
}

exports.isProdAppID = appId => {
  if (!appId) {
    throw NO_APP_ERROR
  }
  return appId.startsWith(APP_PREFIX) && !exports.isDevAppID(appId)
}

exports.isDevApp = app => {
  if (!app) {
    throw NO_APP_ERROR
  }
  return exports.isDevAppID(app.appId)
}

/**
 * Convert a development app ID to a deployed app ID.
 */
exports.getProdAppID = appId => {
  // if dev, convert it
  if (appId.startsWith(APP_DEV_PREFIX)) {
    const id = appId.split(APP_DEV_PREFIX)[1]
    return `${APP_PREFIX}${id}`
  }
  return appId
}

/**
 * Convert a deployed app ID to a development app ID.
 */
exports.getDevelopmentAppID = appId => {
  if (!appId.startsWith(APP_DEV_PREFIX)) {
    const id = appId.split(APP_PREFIX)[1]
    return `${APP_DEV_PREFIX}${id}`
  }
  return appId
}
