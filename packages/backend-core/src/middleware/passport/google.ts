import { ssoCallbackUrl } from "./utils"
import { authenticateThirdParty, SaveUserFunction } from "./third-party-common"
import { ConfigType, GoogleConfig, Database, SSOProfile } from "@budibase/types"
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy

export function buildVerifyFn(saveUserFn?: SaveUserFunction) {
  return (
    accessToken: string,
    refreshToken: string,
    profile: SSOProfile,
    done: Function
  ) => {
    const thirdPartyUser = {
      provider: profile.provider, // should always be 'google'
      providerType: "google",
      userId: profile.id,
      profile: profile,
      email: profile._json.email,
      oauth2: {
        accessToken,
        refreshToken,
      },
    }

    return authenticateThirdParty(
      thirdPartyUser,
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
  config: GoogleConfig["config"],
  callbackUrl: string,
  saveUserFn?: SaveUserFunction
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
    console.error(err)
    throw new Error(`Error constructing google authentication strategy: ${err}`)
  }
}

export async function getCallbackUrl(
  db: Database,
  config: { callbackURL?: string }
) {
  return ssoCallbackUrl(db, config, ConfigType.GOOGLE)
}
