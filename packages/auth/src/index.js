const passport = require("koa-passport")
const LocalStrategy = require("passport-local").Strategy
const JwtStrategy = require("passport-jwt").Strategy
const constants = require("./constants")
const { StaticDatabases, DocumentTypes } = require("./db/utils")
const { jwt, local, google, authenticated } = require("./middleware")
const { Cookies, UserStatus } = require("./constants")
const { hash, compare } = require("./hashing")
const {
  getAppId,
  setCookie,
  getCookie,
  clearCookie,
  isClient,
} = require("./utils")
const { setDB, getDB } = require("./db")
const {
  generateUserID,
  getUserParams,
  generateGroupID,
  getGroupParams,
  getEmailFromUserID,
  generateConfigID,
  getConfigParams,
} = require("./db/utils")

// Strategies
passport.use(new LocalStrategy(local.options, local.authenticate))
passport.use(new JwtStrategy(jwt.options, jwt.authenticate))
// passport.use(new GoogleStrategy(google.options, google.authenticate))

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
  utils: {
    ...require("./utils"),
    ...require("./hashing"),
  },
  auth: {
    buildAuthMiddleware: authenticated,
    passport,
    middlewares: {
      google,
    },
  },
  constants,
  passport,
  Cookies,
  UserStatus,
  DocumentTypes,
  StaticDatabases,
  generateUserID,
  getUserParams,
  generateGroupID,
  getGroupParams,
  getEmailFromUserID,
  generateConfigID,
  getConfigParams,
  hash,
  compare,
  getAppId,
  setCookie,
  getCookie,
  clearCookie,
  authenticated,
  isClient,
}
