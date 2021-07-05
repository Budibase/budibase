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

// async function authenticate(token, tokenSecret, profile, done) {
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
    const users = await db.query(`database/${ViewNames.USER_BY_EMAIL}`, {
      key: profile._json.email,
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
      return done(
        new Error(
          "email does not yet exist. You must set up your local budibase account first."
        ),
        false
      )
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
