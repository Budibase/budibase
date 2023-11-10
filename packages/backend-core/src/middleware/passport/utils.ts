import { getTenantId, isMultiTenant } from "../../context"
import * as configs from "../../configs"
import { ConfigType, GoogleInnerConfig } from "@budibase/types"

/**
 * Utility to handle authentication errors.
 *
 * @param done The passport callback.
 * @param message Message that will be returned in the response body
 * @param err (Optional) error that will be logged
 */

export function authError(done: Function, message: string, err?: any) {
  return done(
    err,
    null, // never return a user
    { message: message }
  )
}

export async function ssoCallbackUrl(
  type: ConfigType,
  config?: GoogleInnerConfig
) {
  // incase there is a callback URL from before
  if (config && (config as GoogleInnerConfig).callbackURL) {
    return (config as GoogleInnerConfig).callbackURL as string
  }
  const settingsConfig = await configs.getSettingsConfig()

  let callbackUrl = `/api/global/auth`
  if (isMultiTenant()) {
    callbackUrl += `/${getTenantId()}`
  }
  callbackUrl += `/${type}/callback`

  return `${settingsConfig.platformUrl}${callbackUrl}`
}
