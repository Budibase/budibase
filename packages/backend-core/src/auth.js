const passport = require("koa-passport")
const LocalStrategy = require("passport-local").Strategy
const JwtStrategy = require("passport-jwt").Strategy
const { getGlobalDB } = require("./tenancy")
const {
  jwt,
  local,
  authenticated,
  google,
  oidc,
  auditLog,
  tenancy,
  appTenancy,
  authError,
  csrf,
  internalApi,
} = require("./middleware")

// Strategies
passport.use(new LocalStrategy(local.options, local.authenticate))
passport.use(new JwtStrategy(jwt.options, jwt.authenticate))

passport.serializeUser((user, done) => done(null, user))

passport.deserializeUser(async (user, done) => {
  const db = getGlobalDB()

  try {
    const user = await db.get(user._id)
    return done(null, user)
  } catch (err) {
    console.error("User not found", err)
    return done(null, false, { message: "User not found" })
  }
})

module.exports = {
  buildAuthMiddleware: authenticated,
  passport,
  google,
  oidc,
  jwt: require("jsonwebtoken"),
  buildTenancyMiddleware: tenancy,
  buildAppTenancyMiddleware: appTenancy,
  auditLog,
  authError,
  buildCsrfMiddleware: csrf,
  internalApi,
}
