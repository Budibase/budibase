const env = require("../../environment")
const jwt = require("jsonwebtoken")
const database = require("../../db")
const { StaticDatabases, generateUserID } = require("../../db/utils")

exports.options = {
  clientID: env.GOOGLE_CLIENT_ID,
  clientSecret: env.GOOGLE_CLIENT_SECRET,
  callbackURL: env.GOOGLE_AUTH_CALLBACK_URL,
}

exports.authenticate = async function(token, tokenSecret, profile, done) {
  if (!profile._json.email) return done(null, false, "Email Required.")

  // Check the user exists in the instance DB by email
  const db = new database.CouchDB(StaticDatabases.GLOBAL.name)

  let dbUser
  const userId = generateUserID(profile._json.email)

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
