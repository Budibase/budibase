import { isMultiTenant, getTenantId } from "../../tenancy"
import { getScopedConfig } from "../../db"
import { ConfigType, Database, Config } from "@budibase/types"

/**
 * Utility to handle authentication errors.
 *
 * @param {*} done The passport callback.
 * @param {*} message Message that will be returned in the response body
 * @param {*} err (Optional) error that will be logged
 */

export function authError(done: Function, message: string, err?: any) {
  return done(
    err,
    null, // never return a user
    { message: message }
  )
}

export async function ssoCallbackUrl(
  db: Database,
  config?: { callbackURL?: string },
  type?: ConfigType
) {
  // incase there is a callback URL from before
  if (config && config.callbackURL) {
    return config.callbackURL
  }
  const publicConfig = await getScopedConfig(db, {
    type: ConfigType.SETTINGS,
  })

  let callbackUrl = `/api/global/auth`
  if (isMultiTenant()) {
    callbackUrl += `/${getTenantId()}`
  }
  callbackUrl += `/${type}/callback`

  return `${publicConfig.platformUrl}${callbackUrl}`
}
