const passport = require("koa-passport")
const LocalStrategy = require("passport-local").Strategy
const JwtStrategy = require("passport-jwt").Strategy
const { StaticDatabases } = require("./db/utils")
const { jwt, local, authenticated, google } = require("./middleware")
const { setDB, getDB } = require("./db")

// Strategies
passport.use(new LocalStrategy(local.options, local.authenticate))
passport.use(new JwtStrategy(jwt.options, jwt.authenticate))

passport.serializeUser((user, done) => done(null, user))

passport.deserializeUser(async (user, done) => {
  const db = getDB(StaticDatabases.GLOBAL.name)

  try {
    const user = await db.get(user._id)
    return done(null, user)
  } catch (err) {
    console.error("User not found", err)
    return done(null, false, { message: "User not found" })
  }
})

module.exports = {
  init(pouch) {
    setDB(pouch)
  },
  db: require("./db/utils"),
  redis: {
    Client: require("./redis"),
    utils: require("./redis/utils"),
  },
  utils: {
    ...require("./utils"),
    ...require("./hashing"),
  },
  auth: {
    buildAuthMiddleware: authenticated,
    passport,
    google,
    jwt: require("jsonwebtoken"),
  },
  StaticDatabases,
  constants: require("./constants"),
}
