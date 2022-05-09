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
 * Generates a development app ID from a real app ID.
 * @returns {string} the dev app ID which can be used for dev database.
 */
exports.getDevelopmentAppID = appId => {
  if (!appId || appId.startsWith(APP_DEV_PREFIX)) {
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
exports.getProdAppID = appId => {
  if (!appId || !appId.startsWith(APP_DEV_PREFIX)) {
    return appId
  }
  // split to take off the app_dev element, then join it together incase any other app_ exist
  const split = appId.split(APP_DEV_PREFIX)
  split.shift()
  const rest = split.join(APP_DEV_PREFIX)
  return `${APP_PREFIX}${rest}`
}
