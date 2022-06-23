const { getGlobalDB, isMultiTenant, getTenantId } = require("../../tenancy")
const { getScopedConfig } = require("../../db/utils")
const { Configs } = require("../../constants")

/**
 * Utility to handle authentication errors.
 *
 * @param {*} done The passport callback.
 * @param {*} message Message that will be returned in the response body
 * @param {*} err (Optional) error that will be logged
 */

exports.authError = function (done, message, err = null) {
  return done(
    err,
    null, // never return a user
    { message: message }
  )
}

exports.ssoCallbackUrl = async (db, config, type) => {
  // incase there is a callback URL from before
  if (config && config.callbackURL) {
    return config.callbackURL
  }

  const dbx = db ? db : getGlobalDB()
  const publicConfig = await getScopedConfig(dbx, {
    type: Configs.SETTINGS,
  })

  let callbackUrl = `/api/global/auth`
  if (isMultiTenant()) {
    callbackUrl += `/${getTenantId()}`
  }
  callbackUrl += `/${type}/callback`

  return `${publicConfig.platformUrl}${callbackUrl}`
}
