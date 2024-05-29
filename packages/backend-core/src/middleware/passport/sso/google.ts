import { ssoCallbackUrl } from "../utils"
import * as sso from "./sso"
import {
  ConfigType,
  SSOProfile,
  SSOAuthDetails,
  SSOProviderType,
  SaveSSOUserFunction,
  GoogleInnerConfig,
} from "@budibase/types"

const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy

export function buildVerifyFn(saveUserFn: SaveSSOUserFunction) {
  return (
    accessToken: string,
    refreshToken: string,
    profile: SSOProfile,
    done: Function
  ) => {
    const details: SSOAuthDetails = {
      provider: "google",
      providerType: SSOProviderType.GOOGLE,
      userId: profile.id,
      profile: profile,
      email: profile._json.email,
      oauth2: {
        accessToken,
        refreshToken,
      },
    }

    return sso.authenticate(
      details,
      true, // require local accounts to exist
      done,
      saveUserFn
    )
  }
}

/**
 * Create an instance of the google passport strategy. This wrapper fetches the configuration
 * from couchDB rather than environment variables, using this factory is necessary for dynamically configuring passport.
 * @returns Dynamically configured Passport Google Strategy
 */
export async function strategyFactory(
  config: GoogleInnerConfig,
  callbackUrl: string,
  saveUserFn: SaveSSOUserFunction
) {
  try {
    const { clientID, clientSecret } = config

    if (!clientID || !clientSecret) {
      throw new Error(
        "Configuration invalid. Must contain google clientID and clientSecret"
      )
    }

    const verify = buildVerifyFn(saveUserFn)
    return new GoogleStrategy(
      {
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: callbackUrl,
      },
      verify
    )
  } catch (err: any) {
    throw new Error(`Error constructing google authentication strategy: ${err}`)
  }
}

export async function getCallbackUrl(config: GoogleInnerConfig) {
  return ssoCallbackUrl(ConfigType.GOOGLE, config)
}
