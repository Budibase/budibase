const passport = require("koa-passport")
const LocalStrategy = require("passport-local").Strategy
const JwtStrategy = require("passport-jwt").Strategy
// const GoogleStrategy = require("passport-google-oauth").Strategy
const database = require("./db")
const { StaticDatabases } = require("./db/utils")
const { jwt, local, authenticated } = require("./middleware")
const { Cookies, UserStatus } = require("./constants")
const { hash, compare } = require("./hashing")
const {
  getAppId,
  setCookie,
  getCookie,
  clearCookie,
  isClient,
} = require("./utils")
const {
  generateUserID,
  getUserParams,
  getEmailFromUserID,
} = require("./db/utils")

// Strategies
passport.use(new LocalStrategy(local.options, local.authenticate))
passport.use(new JwtStrategy(jwt.options, jwt.authenticate))
// passport.use(new GoogleStrategy(google.options, google.authenticate))

passport.serializeUser((user, done) => done(null, user))

passport.deserializeUser(async (user, done) => {
  const db = new database.CouchDB(StaticDatabases.GLOBAL.name)

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
    database.setDB(pouch)
  },
  passport,
  Cookies,
  UserStatus,
  StaticDatabases,
  generateUserID,
  getUserParams,
  getEmailFromUserID,
  hash,
  compare,
  getAppId,
  setCookie,
  getCookie,
  clearCookie,
  authenticated,
  isClient,
}
