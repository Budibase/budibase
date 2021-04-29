const env = require("../../environment")
const jwt = require("jsonwebtoken")
const database = require("../../db")
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy
const { StaticDatabases, generateGlobalUserID } = require("../../db/utils")

async function authenticate(token, tokenSecret, profile, done) {
  // Check the user exists in the instance DB by email
  const db = database.getDB(StaticDatabases.GLOBAL.name)

  let dbUser
  const userId = generateGlobalUserID(profile.id)

  try {
    // use the google profile id
    dbUser = await db.get(userId)
  } catch (err) {
    console.error("Google user not found. Creating..")
    // create the user
    const user = {
      _id: userId,
      provider: profile.provider,
      roles: {},
      builder: {
        global: true,
      },
      ...profile._json,
    }
    const response = await db.post(user)

    dbUser = user
    dbUser._rev = response.rev
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
exports.strategyFactory = async function(config) {
  try {
    const { clientID, clientSecret, callbackURL } = config

    if (!clientID || !clientSecret || !callbackURL) {
      throw new Error(
        "Configuration invalid. Must contain google clientID, clientSecret and callbackURL"
      )
    }

    return new GoogleStrategy(
      {
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: config.callbackURL,
      },
      authenticate
    )
  } catch (err) {
    console.error(err)
    throw new Error("Error constructing google authentication strategy", err)
  }
}
