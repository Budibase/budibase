const env = require("../../environment")
const jwt = require("jsonwebtoken")
const database = require("../../db")
const fetch = require("node-fetch")
const OIDCStrategy = require("@techpass/passport-openidconnect").Strategy
const {
  StaticDatabases,
  generateGlobalUserID,
  ViewNames,
} = require("../../db/utils")

/**
 * Attempt to parse the users email address. 
 * 
 * It is not guaranteed that the email will be returned by the user info endpoint (e.g. github connected account used in azure ad).
 * Fallback to the id token where possible.
 * 
 * @param {*} profile The structured profile created by passport using the user info endpoint
 * @param {*} jwtClaims The raw claims returned in the id token
 */
function getEmail(profile, jwtClaims) {
  if (profile._json.email) {
    return profile._json.email
  }

  if (jwtClaims.email) {
    return jwtClaims.email
  }

  return null;
}

/**
 * 
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
  // Check the user exists in the instance DB by email
  const db = database.getDB(StaticDatabases.GLOBAL.name)

  let dbUser

  const userId = generateGlobalUserID(profile.id)

  try {
    // use the OIDC profile id
    dbUser = await db.get(userId)
  } catch (err) {
    const user = {
      _id: userId,
      provider: profile.provider,
      roles: {},
      ...profile._json,
    }

    // check if an account with the OIDC email address exists locally
    const email = getEmail(profile, jwtClaims)
    if (!email) {
      return done(null, false, { message: "No email address found" })
    }

    const users = await db.query(`database/${ViewNames.USER_BY_EMAIL}`, {
      key: email,
      include_docs: true,
    })

    // OIDC user already exists by email
    if (users.rows.length > 0) {
      const existing = users.rows[0].doc

      // remove the local account to avoid conflicts
      await db.remove(existing._id, existing._rev)

      // merge with existing account
      user.roles = existing.roles
      user.builder = existing.builder
      user.admin = existing.admin

      const response = await db.post(user)
      dbUser = user
      dbUser._rev = response.rev
    } else {
      return done(null, false, { message: "Email does not yet exist. You must set up your local budibase account first." })
    }
  }

  // authenticate
  const payload = {
    userId: dbUser._id,
    builder: dbUser.builder,
    email: dbUser.email,
  }

  dbUser.token = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "1 day",
  })

  return done(null, dbUser)
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
