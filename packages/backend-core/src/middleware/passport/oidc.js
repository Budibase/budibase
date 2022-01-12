const fetch = require("node-fetch")
const OIDCStrategy = require("@techpass/passport-openidconnect").Strategy
const { authenticateThirdParty } = require("./third-party-common")

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
      refreshToken: refreshToken,
    },
  }

  return authenticateThirdParty(
    thirdPartyUser,
    false, // don't require local accounts to exist
    done
  )
}

/**
 * @param {*} profile The structured profile created by passport using the user info endpoint
 * @param {*} jwtClaims The claims returned in the id token
 */
function getEmail(profile, jwtClaims) {
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

function validEmail(value) {
  return (
    value &&
    !!value.match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  )
}

/**
 * Create an instance of the oidc passport strategy. This wrapper fetches the configuration
 * from couchDB rather than environment variables, using this factory is necessary for dynamically configuring passport.
 * @returns Dynamically configured Passport OIDC Strategy
 */
exports.strategyFactory = async function (config, callbackUrl) {
  try {
    const { clientID, clientSecret, configUrl } = config

    if (!clientID || !clientSecret || !callbackUrl || !configUrl) {
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

    return new OIDCStrategy(
      {
        issuer: body.issuer,
        authorizationURL: body.authorization_endpoint,
        tokenURL: body.token_endpoint,
        userInfoURL: body.userinfo_endpoint,
        clientID: clientID,
        clientSecret: clientSecret,
        callbackURL: callbackUrl,
      },
      authenticate
    )
  } catch (err) {
    console.error(err)
    throw new Error("Error constructing OIDC authentication strategy", err)
  }
}

// expose for testing
exports.authenticate = authenticate
