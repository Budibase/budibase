import fetch from "node-fetch"
import * as sso from "./sso"
import { ssoCallbackUrl } from "../utils"
import { validEmail } from "../../../utils"
import {
  ConfigType,
  OIDCInnerConfig,
  SSOProfile,
  OIDCStrategyConfiguration,
  SSOAuthDetails,
  SSOProviderType,
  JwtClaims,
  SaveSSOUserFunction,
} from "@budibase/types"

const OIDCStrategy = require("@techpass/passport-openidconnect").Strategy

export function buildVerifyFn(saveUserFn: SaveSSOUserFunction) {
  /**
   * @param issuer The identity provider base URL
   * @param sub The user ID
   * @param profile The user profile information. Created by passport from the /userinfo response
   * @param jwtClaims The parsed id_token claims
   * @param accessToken The access_token for contacting the identity provider - may or may not be a JWT
   * @param refreshToken The refresh_token for obtaining a new access_token - usually not a JWT
   * @param idToken The id_token - always a JWT
   * @param params The response body from requesting an access_token
   * @param done The passport callback: err, user, info
   */
  return async (
    issuer: string,
    sub: string,
    profile: SSOProfile,
    jwtClaims: JwtClaims,
    accessToken: string,
    refreshToken: string,
    idToken: string,
    params: any,
    done: Function
  ) => {
    const details: SSOAuthDetails = {
      // store the issuer info to enable sync in future
      provider: issuer,
      providerType: SSOProviderType.OIDC,
      userId: profile.id,
      profile: profile,
      email: getEmail(profile, jwtClaims),
      oauth2: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    }

    return sso.authenticate(
      details,
      false, // don't require local accounts to exist
      done,
      saveUserFn
    )
  }
}

/**
 * @param profile The structured profile created by passport using the user info endpoint
 * @param jwtClaims The claims returned in the id token
 */
function getEmail(profile: SSOProfile, jwtClaims: JwtClaims) {
  // profile not guaranteed to contain email e.g. github connected azure ad account
  if (profile._json.email) {
    return profile._json.email
  }

  // fallback to id token email
  if (jwtClaims.email) {
    return jwtClaims.email
  }

  // fallback to id token preferred username
  const username = jwtClaims.preferred_username
  if (username && validEmail(username)) {
    return username
  }

  throw new Error(
    `Could not determine user email from profile ${JSON.stringify(
      profile
    )} and claims ${JSON.stringify(jwtClaims)}`
  )
}

/**
 * Create an instance of the oidc passport strategy. This wrapper fetches the configuration
 * from couchDB rather than environment variables, using this factory is necessary for dynamically configuring passport.
 * @returns Dynamically configured Passport OIDC Strategy
 */
export async function strategyFactory(
  config: OIDCStrategyConfiguration,
  saveUserFn: SaveSSOUserFunction
) {
  try {
    const verify = buildVerifyFn(saveUserFn)
    const strategy = new OIDCStrategy(config, verify)
    strategy.name = "oidc"
    return strategy
  } catch (err: any) {
    throw new Error(`Error constructing OIDC authentication strategy - ${err}`)
  }
}

export async function fetchStrategyConfig(
  oidcConfig: OIDCInnerConfig,
  callbackUrl?: string
): Promise<OIDCStrategyConfiguration> {
  try {
    const { clientID, clientSecret, configUrl } = oidcConfig

    if (!clientID || !clientSecret || !callbackUrl || !configUrl) {
      // check for remote config and all required elements
      throw new Error(
        "Configuration invalid. Must contain clientID, clientSecret, callbackUrl and configUrl"
      )
    }

    const response = await fetch(configUrl)

    if (!response.ok) {
      throw new Error(
        `Unexpected response when fetching openid-configuration: ${response.statusText}`
      )
    }

    const body = await response.json()

    return {
      issuer: body.issuer,
      authorizationURL: body.authorization_endpoint,
      tokenURL: body.token_endpoint,
      userInfoURL: body.userinfo_endpoint,
      clientID: clientID,
      clientSecret: clientSecret,
      callbackURL: callbackUrl,
    }
  } catch (err) {
    throw new Error(
      `Error constructing OIDC authentication configuration - ${err}`
    )
  }
}

export async function getCallbackUrl() {
  return ssoCallbackUrl(ConfigType.OIDC)
}
