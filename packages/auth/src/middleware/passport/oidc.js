const env = require("../../environment")
const jwt = require("jsonwebtoken")
const database = require("../../db")
const OIDCStrategy = require("@techpass/passport-openidconnect").Strategy
const {
  StaticDatabases,
  generateGlobalUserID,
  ViewNames,
} = require("../../db/utils")

// async function authenticate(token, tokenSecret, profile, done) {
async function authenticate(issuer, sub, profile, jwtClaims, accessToken, refreshToken, idToken, params, done) {
  // Check the user exists in the instance DB by email
  const db = database.getDB(StaticDatabases.GLOBAL.name)

  let dbUser

  const userId = generateGlobalUserID(profile.id)

  try {
    // use the google profile id
    dbUser = await db.get(userId)
  } catch (err) {
    const user = {
      _id: userId,
      provider: profile.provider,
      roles: {},
      ...profile._json,
    }

    // check if an account with the google email address exists locally
    const users = await db.query(`database/${ViewNames.USER_BY_EMAIL}`, {
      key: profile._json.email,
      include_docs: true,
    })

    // Google user already exists by email
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
 * Create an instance of the google passport strategy. This wrapper fetches the configuration
 * from couchDB rather than environment variables, using this factory is necessary for dynamically configuring passport.
 * @returns Dynamically configured Passport Google Strategy
 */
exports.strategyFactory = async function () {
  try {

    /*
    const { clientID, clientSecret, callbackURL } = config

    if (!clientID || !clientSecret || !callbackURL) {
      throw new Error(
        "Configuration invalid. Must contain google clientID, clientSecret and callbackURL"
      )
    }
    */

    return new OIDCStrategy(
      {
        issuer: "https://base.uri/auth/realms/realm_name",
        authorizationURL: "https://base.uri/auth/realms/realm_name/protocol/openid-connect/auth",
        tokenURL: "https://base.uri/auth/realms/realm_name/protocol/openid-connect/token",
        userInfoURL: "https://base.uri/auth/realms/realm_name/protocol/openid-connect/userinfo",
        clientID: "my_client_id",
        clientSecret: "my_client_secret",
        callbackURL: "http://localhost:10000/api/admin/auth/oidc/callback",
        scope: "openid profile email",
      },
      authenticate
    )
  } catch (err) {
    console.error(err)
    throw new Error("Error constructing OIDC authentication strategy", err)
  }
}
