const fetch = require("node-fetch")
const OIDCStrategy = require("@techpass/passport-openidconnect").Strategy
const { authenticateThirdParty } = require("./third-party-common")

/**
 * @param {*} profile The structured profile created by passport using the user info endpoint
 * @param {*} jwtClaims The claims returned in the id token
 */
function getEmail(profile, jwtClaims) {
  // profile not guaranteed to contain email e.g. github connected azure ad account
  if (profile._json.email) {
    return profile._json.email
  }

  // fallback to id token
  if (jwtClaims.email) {
    return jwtClaims.email
  }

  return null;
}

/**
 * @param {*} issuer The identity provider base URL
 * @param {*} sub The user ID
 * @param {*} profile The user profile information. Created by passport from the /userinfo response
 * @param {*} jwtClaims The parsed id_token claims
 * @param {*} accessToken The access_token for contacting the identity provider - may or may not be a JWT
 * @param {*} refreshToken The refresh_token for obtaining a new access_token - usually not a JWT
 * @param {*} idToken The id_token - always a JWT
 * @param {*} params The response body from requesting an access_token
 * @param {*} done The passport callback: err, user, info
 * @returns 
 */
async function authenticate(
  issuer,
  sub,
  profile,
  jwtClaims,
  accessToken,
  refreshToken,
  idToken,
  params,
  done
) {
  const thirdPartyUser = {
    // store the issuer info to enable sync in future
    provider: issuer, 
    providerType: "oidc",
    userId: profile.id,
    profile: profile,
    email: getEmail(profile, jwtClaims),
    oauth2: {
      accessToken: accessToken,
      refreshToken: refreshToken
    }
  }

  return authenticateThirdParty(
    thirdPartyUser, 
    false, // don't require local accounts to exist
    done)
}

/**
 * Create an instance of the oidc passport strategy. This wrapper fetches the configuration
 * from couchDB rather than environment variables, using this factory is necessary for dynamically configuring passport.
 * @returns Dynamically configured Passport OIDC Strategy
 */
exports.strategyFactory = async function (callbackUrl) {
  try {
    const configurationUrl =
      "https://login.microsoftonline.com/2668c0dd-7ed2-4db3-b387-05b6f9204a70/v2.0/.well-known/openid-configuration"
    const clientSecret = "g-ty~2iW.bo.88xj_QI6~hdc-H8mP2Xbnd"
    const clientId = "bed2017b-2f53-42a9-8ef9-e58918935e07"

    if (!clientId || !clientSecret || !callbackUrl || !configurationUrl) {
      throw new Error(
        "Configuration invalid. Must contain clientID, clientSecret, callbackUrl and configurationUrl"
      )
    }

    const response = await fetch(configurationUrl)

    if (!response.ok) {
      throw new Error(`Unexpected response when fetching openid-configuration: ${response.statusText}`)
    }

    const body = await response.json()

    return new OIDCStrategy(
      {
        issuer: body.issuer,
        authorizationURL: body.authorization_endpoint,
        tokenURL: body.token_endpoint,
        userInfoURL: body.userinfo_endpoint,
        clientID: clientId,
        clientSecret: clientSecret,
        callbackURL: callbackUrl,
        scope: "profile email",
      },
      authenticate
    )
    
  } catch (err) {
    console.error(err)
    throw new Error("Error constructing OIDC authentication strategy", err)
  }
}
