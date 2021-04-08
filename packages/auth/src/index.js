const passport = require("koa-passport")
const LocalStrategy = require("passport-local").Strategy
const JwtStrategy = require("passport-jwt").Strategy
// const GoogleStrategy = require("passport-google-oauth").Strategy
const CouchDB = require("./db")
const { StaticDatabases } = require("./db/utils")
const { jwt, local, google } = require("./middleware")
const { Cookies, UserStatus } = require("./constants")
const { hash, compare } = require("./hashing")
const { getAppId, setCookie } = require("./utils")
const { generateUserID, getUserParams, getEmailFromUserID } = require("./db/utils")

// Strategies
passport.use(new LocalStrategy(local.options, local.authenticate))
passport.use(new JwtStrategy(jwt.options, jwt.authenticate))
// passport.use(new GoogleStrategy(google.options, google.authenticate))

passport.serializeUser((user, done) => done(null, user))

passport.deserializeUser(async (user, done) => {
  const db = new CouchDB(StaticDatabases.USER.name)

  try {
    const user = await db.get(user._id)
    return done(null, user)
  } catch (err) {
    console.error("User not found", err)
    return done(null, false, { message: "User not found" })
  }
})

module.exports = {
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
}
