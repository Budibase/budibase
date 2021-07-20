const passport = require("koa-passport")
const LocalStrategy = require("passport-local").Strategy
const JwtStrategy = require("passport-jwt").Strategy
const { StaticDatabases } = require("./db/utils")
const {
  jwt,
  local,
  authenticated,
  google,
  oidc,
  auditLog,
} = require("./middleware")
const { setDB, getDB } = require("./db")
const userCache = require("./cache/user")

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
  objectStore: {
    ...require("./objectStore"),
    ...require("./objectStore/utils"),
  },
  utils: {
    ...require("./utils"),
    ...require("./hashing"),
  },
  auth: {
    buildAuthMiddleware: authenticated,
    passport,
    google,
    oidc,
    jwt: require("jsonwebtoken"),
    auditLog,
  },
  cache: {
    user: userCache,
  },
  StaticDatabases,
  constants: require("./constants"),
}
